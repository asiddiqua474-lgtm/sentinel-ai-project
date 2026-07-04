import { MongoClient } from 'mongodb'
import OpenAI from 'openai'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

export const maxDuration = 60
export const runtime = 'nodejs'

// ---------- OpenAI (GPT-5) via Emergent Universal Key ----------
const openai = new OpenAI({
  apiKey: process.env.EMERGENT_LLM_KEY,
  baseURL: 'https://integrations.emergentagent.com/llm/v1',
})

// ---------- MongoDB connection (cached) ----------
if (!global._mongoClientPromise) {
  const client = new MongoClient(process.env.MONGO_URL)
  global._mongoClientPromise = client.connect()
}
const clientPromise = global._mongoClientPromise

const DB_NAME = 'sentinel_rag'
const COLLECTION = 'memory_chunks'

async function getCollection() {
  const client = await clientPromise
  const col = client.db(DB_NAME).collection(COLLECTION)
  return col
}

// ---------- Text preprocessing ----------
const STOPWORDS = new Set(['a','an','the','is','are','was','were','be','been','being','have','has','had','do','does','did','will','would','shall','should','can','could','may','might','must','and','or','but','if','then','else','when','where','why','how','what','which','who','whom','this','that','these','those','i','you','he','she','it','we','they','me','him','her','us','them','my','your','his','its','our','their','of','in','on','at','to','for','with','by','from','as','about','into','over','under','between','through','during','before','after'])
function tokenize(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s₹%.-]/gu, ' ')
    .split(/\s+/)
    .filter((t) => t && t.length > 1 && !STOPWORDS.has(t))
}

// ---------- Parent-child chunking with overlap ----------
function smartChunk(text, chunkSize = 400, overlap = 60) {
  const paragraphs = text.split(/\n\n+/).map((p) => p.trim()).filter(Boolean)
  const chunks = []
  let buffer = ''
  for (const p of paragraphs) {
    if ((buffer + '\n\n' + p).length <= chunkSize) {
      buffer = buffer ? buffer + '\n\n' + p : p
    } else {
      if (buffer) chunks.push(buffer)
      if (p.length > chunkSize) {
        for (let i = 0; i < p.length; i += chunkSize - overlap) {
          chunks.push(p.slice(i, i + chunkSize))
        }
        buffer = ''
      } else {
        buffer = p
      }
    }
  }
  if (buffer) chunks.push(buffer)
  return chunks
}

// ---------- BM25 scoring (Okapi BM25) ----------
// Given precomputed doc term frequencies + corpus stats, score against a query.
function bm25Score(queryTerms, doc, corpusStats, k1 = 1.5, b = 0.75) {
  const { N, avgdl, df } = corpusStats
  const dl = doc.doc_len || 1
  let score = 0
  for (const t of queryTerms) {
    const tf = doc.tf?.[t] || 0
    if (!tf) continue
    const dfT = df[t] || 0
    const idf = Math.log((N - dfT + 0.5) / (dfT + 0.5) + 1)
    const numerator = tf * (k1 + 1)
    const denom = tf + k1 * (1 - b + b * (dl / avgdl))
    score += idf * (numerator / denom)
  }
  return score
}
function computeCorpusStats(docs) {
  const N = docs.length || 1
  const df = {}
  let totalLen = 0
  for (const d of docs) {
    totalLen += d.doc_len || 0
    const seen = new Set()
    for (const t of Object.keys(d.tf || {})) {
      if (!seen.has(t)) { df[t] = (df[t] || 0) + 1; seen.add(t) }
    }
  }
  return { N, avgdl: totalLen / N || 1, df }
}

// ---------- Ingest with strict UPSERT ----------
async function handleIngest(req) {
  const body = await req.json()
  const { doc_id, text, tags = [], title = '' } = body
  if (!doc_id || !text) {
    return NextResponse.json({ error: 'doc_id and text are required' }, { status: 400 })
  }
  const col = await getCollection()

  // ── STRICT UPSERT: delete ALL old chunks with this doc_id first ──
  const existing = await col.findOne({ doc_id })
  const created_at = existing?.created_at || new Date().toISOString()
  const updated_at = new Date().toISOString()
  const deletedCount = (await col.deleteMany({ doc_id })).deletedCount

  // Parent-child chunking
  const chunks = smartChunk(text)
  if (chunks.length === 0) {
    return NextResponse.json({ error: 'text produced no chunks' }, { status: 400 })
  }

  const docs = chunks.map((chunk, i) => {
    // enrich each chunk with parent + tags in the "searchable" surface
    const enriched = `${title}\n\n${(tags || []).join(' ')}\n\n${chunk}`
    const tokens = tokenize(enriched)
    const tf = {}
    for (const t of tokens) tf[t] = (tf[t] || 0) + 1
    return {
      chunk_id: uuidv4(),
      doc_id,
      title,
      tags,
      parent_text: text,           // full parent context
      child_text: chunk,           // retrieval unit
      chunk_index: i,
      total_chunks: chunks.length,
      created_at,
      updated_at,
      tf,
      doc_len: tokens.length,
    }
  })

  await col.insertMany(docs)
  return NextResponse.json({
    success: true,
    doc_id,
    chunks_inserted: docs.length,
    old_chunks_replaced: deletedCount,
    created_at,
    updated_at,
    upsert: existing ? 'UPDATED' : 'INSERTED',
  })
}

// ---------- Query pipeline: BM25 retrieve → LLM rerank → generate ----------
async function handleQuery(req) {
  const { message, top_k = 7 } = await req.json()
  if (!message) return NextResponse.json({ error: 'message required' }, { status: 400 })

  const col = await getCollection()
  const all = await col.find({}, {
    projection: { tf: 1, doc_len: 1, child_text: 1, parent_text: 1, doc_id: 1, tags: 1, title: 1, updated_at: 1, created_at: 1, chunk_index: 1 },
  }).toArray()

  if (all.length === 0) {
    return NextResponse.json({
      answer: "I don't have any documents in memory yet. Please ingest some business data first (invoices, meeting notes, policies, etc.) using the ingest panel — or click 'Load Demo Data' to seed sample docs.",
      sources: [],
      retrieved: 0,
      reranked_to: 0,
    })
  }

  // Step 1: BM25 top_k retrieval
  const qTerms = tokenize(message)
  const stats = computeCorpusStats(all)
  const scored = all.map((d) => ({ ...d, score: bm25Score(qTerms, d, stats) }))
  scored.sort((a, b) => b.score - a.score)
  let topK = scored.slice(0, top_k)

  // If all scores are 0 (query terms don't match anything), fall back to most-recent docs
  if (topK.length && topK[0].score === 0) {
    topK = [...all].sort((a, b) => (b.updated_at || '').localeCompare(a.updated_at || '')).slice(0, top_k)
  }

  // Step 2: LLM Reranker → top 3
  let top3 = topK.slice(0, 3)
  if (topK.length > 3) {
    try {
      const rerankPrompt = `You are a strict relevance reranker. Given the user query, evaluate the ${topK.length} document chunks and return ONLY a JSON object of the form {"top_indices": [i, j, k]} containing exactly 3 zero-based integer indices representing the 3 MOST relevant chunks to the query, ordered best-first. If two chunks contain contradictory facts, prefer the one with the most recent 'updated_at'.

Query: "${message}"

Chunks:
${topK.map((d, i) => `[${i}] (updated: ${d.updated_at}) title="${d.title || ''}" tags=[${(d.tags||[]).join(',')}]\n${d.child_text}`).join('\n\n')}`

      const rr = await openai.chat.completions.create({
        model: 'gpt-5',
        messages: [{ role: 'user', content: rerankPrompt }],
        response_format: { type: 'json_object' },
      })
      const parsed = JSON.parse(rr.choices[0].message.content)
      const idx = Array.isArray(parsed.top_indices) ? parsed.top_indices.slice(0, 3) : [0, 1, 2]
      const picked = idx.map((i) => topK[i]).filter(Boolean)
      if (picked.length > 0) top3 = picked
    } catch (e) {
      console.error('Reranker failed, falling back to BM25 order:', e.message)
    }
  }

  // Step 3: Generate with recency-first system prompt
  const systemPrompt = `You are Sentinel — an AI Chief of Staff for small businesses. Answer using ONLY the provided context snippets.

CRITICAL RULES (in priority order):
1. RECENCY: If two snippets contradict each other, always prioritize the one with the most recent 'updated_at' timestamp. Treat the newest snippet as the absolute source of truth and explicitly note the older one is now outdated.
2. GROUNDING: If the answer is not in the snippets, say "I don't have that information in my memory yet." Do NOT invent facts.
3. CITATIONS: When you use a fact, cite it inline like [doc_id or title].
4. TONE: Executive-brief style. Concise. Bullet points for lists. Use ₹ for currency.

Context Snippets (ordered by relevance, each with metadata):
${top3.map((c, i) => `
--- Snippet ${i + 1} ---
Doc ID: ${c.doc_id}
Title: ${c.title || '(untitled)'}
Tags: ${(c.tags || []).join(', ') || '(none)'}
Created:  ${c.created_at}
Updated:  ${c.updated_at}
Content:
${c.child_text}
`).join('\n')}`

  const final = await openai.chat.completions.create({
    model: 'gpt-5',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message },
    ],
  })

  return NextResponse.json({
    answer: final.choices[0].message.content,
    sources: top3.map((c) => ({
      doc_id: c.doc_id,
      title: c.title,
      tags: c.tags,
      updated_at: c.updated_at,
      created_at: c.created_at,
      score: Number((c.score || 0).toFixed(4)),
      snippet: (c.child_text || '').slice(0, 240),
    })),
    retrieved: topK.length,
    reranked_to: top3.length,
  })
}

// ---------- List documents (grouped by doc_id) ----------
async function handleList() {
  const col = await getCollection()
  const docs = await col.aggregate([
    {
      $group: {
        _id: '$doc_id',
        title: { $first: '$title' },
        tags: { $first: '$tags' },
        chunks: { $sum: 1 },
        created_at: { $first: '$created_at' },
        updated_at: { $max: '$updated_at' },
        preview: { $first: '$child_text' },
      },
    },
    { $sort: { updated_at: -1 } },
  ]).toArray()
  return NextResponse.json({
    documents: docs.map((d) => ({
      doc_id: d._id, title: d.title, tags: d.tags, chunks: d.chunks,
      created_at: d.created_at, updated_at: d.updated_at,
      preview: (d.preview || '').slice(0, 140),
    })),
    total: docs.length,
  })
}

// ---------- Delete a doc ----------
async function handleDelete(req) {
  const { doc_id } = await req.json()
  if (!doc_id) return NextResponse.json({ error: 'doc_id required' }, { status: 400 })
  const col = await getCollection()
  const r = await col.deleteMany({ doc_id })
  return NextResponse.json({ success: true, deleted: r.deletedCount })
}

// ---------- Seed demo data ----------
const SEED_DOCS = [
  {
    doc_id: 'policy-refund',
    title: 'Refund Policy',
    tags: ['policy', 'ops'],
    text: `Apex Electronics Refund Policy.\n\nCustomers may request a refund within 14 days of purchase. Refunds are issued to the original payment method within 5-7 business days. Electronics must be returned unopened and undamaged.\n\nExceptions: Bulk orders above ₹50,000 are non-refundable. Customer support handles disputes escalated by regional reps.`,
  },
  {
    doc_id: 'client-acme',
    title: 'Client: Acme Corp',
    tags: ['client', 'finance'],
    text: `Acme Corp is a premium retail account based in Mumbai. Primary contact: Raj Malhotra (raj@acme.com, +91 98200 12345). They typically place monthly orders of ₹4,000 to ₹6,000.\n\nAs of the latest ledger, Acme Corp has an outstanding invoice of ₹4,200 that is 18 days overdue (Invoice #i102). Historical payment behavior is strong — soft-touch reminders usually resolve within 3 days.`,
  },
  {
    doc_id: 'sku-usbc-hub',
    title: 'SKU: Titanium USB-C Hub',
    tags: ['inventory', 'product'],
    text: `Titanium USB-C Hub (SKU p3). Price ₹89. Current stock: 2 units — CRITICAL. Average weekly sales velocity: 8 units. Lead time from primary supplier: 12 days.\n\nAn emergency purchase order for 200 units has been drafted, cost ₹8,900. Cross-sell opportunity: bundle with Quantum Pro Headset for retail accounts.`,
  },
  {
    doc_id: 'meeting-weekly-ops',
    title: 'Weekly Ops Meeting Notes',
    tags: ['meeting', 'ops'],
    text: `Weekly operations meeting notes.\n\nDecisions:\n- Approved 5% price increase across all SKUs, effective next cycle.\n- Nova Retail flagged as churn risk (24 days no order); Priya to reach out.\n- Emergency PO for USB-C Hub approved.\n\nRevenue update: ₹1,42,500 MoM, up 12%. Overdue AR: ₹8,400 across 2 invoices.`,
  },
]
async function handleSeed() {
  const col = await getCollection()
  let inserted = 0, replaced = 0
  for (const d of SEED_DOCS) {
    const existing = await col.findOne({ doc_id: d.doc_id })
    const created_at = existing?.created_at || new Date().toISOString()
    const updated_at = new Date().toISOString()
    replaced += (await col.deleteMany({ doc_id: d.doc_id })).deletedCount
    const chunks = smartChunk(d.text)
    const rows = chunks.map((c, i) => {
      const enriched = `${d.title}\n\n${d.tags.join(' ')}\n\n${c}`
      const tokens = tokenize(enriched)
      const tf = {}
      for (const t of tokens) tf[t] = (tf[t] || 0) + 1
      return {
        chunk_id: uuidv4(),
        doc_id: d.doc_id,
        title: d.title,
        tags: d.tags,
        parent_text: d.text,
        child_text: c,
        chunk_index: i,
        total_chunks: chunks.length,
        created_at,
        updated_at,
        tf,
        doc_len: tokens.length,
      }
    })
    await col.insertMany(rows)
    inserted += rows.length
  }
  return NextResponse.json({ success: true, seeded_docs: SEED_DOCS.length, chunks_inserted: inserted, chunks_replaced: replaced })
}

// ---------- Router ----------
export async function POST(req, ctx) {
  try {
    const { path } = await ctx.params
    const seg = path?.[0]
    const sub = path?.[1]
    if (seg === 'memory' && sub === 'ingest') return await handleIngest(req)
    if (seg === 'memory' && sub === 'query') return await handleQuery(req)
    if (seg === 'memory' && sub === 'delete') return await handleDelete(req)
    if (seg === 'memory' && sub === 'seed') return await handleSeed()
    return NextResponse.json({ error: 'route not found', got: path }, { status: 404 })
  } catch (e) {
    console.error('API POST error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
export async function GET(req, ctx) {
  try {
    const { path } = await ctx.params
    const seg = path?.[0]
    const sub = path?.[1]
    if (seg === 'memory' && sub === 'list') return await handleList()
    if (seg === 'health') return NextResponse.json({ ok: true, provider: 'openai@emergent', model: 'gpt-5', retrieval: 'bm25' })
    return NextResponse.json({ error: 'route not found', got: path }, { status: 404 })
  } catch (e) {
    console.error('API GET error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
