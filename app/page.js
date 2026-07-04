'use client'

import { useState, useMemo } from 'react'
import {
  LayoutDashboard, Brain, BarChart3, Ghost, FlaskConical, Settings,
  TrendingUp, Users, AlertTriangle, DollarSign, Search, Sparkles,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock,
  Package, Mail, ShoppingCart, Zap, Bell, ChevronRight, Send,
  Lightbulb, Target, Activity, Command
} from 'lucide-react'

// ---------------- Static Demo Database ----------------
const BASE_COMPANY = {
  name: 'Apex Electronics LLC',
  owner: 'Zaara',
  healthScore: 84,
  healthDelta: 3,
  kpis: {
    revenue: 142500,
    revenueDelta: 12,
    activeCustomers: 342,
    lowStockAlerts: 3,
    overdueTotal: 8400,
  },
  inventory: [
    { id: 'p1', name: 'Quantum Pro Headset', stock: 4, price: 299, status: 'Low Stock' },
    { id: 'p2', name: 'Apex Magic Trackpad', stock: 45, price: 129, status: 'Healthy' },
    { id: 'p3', name: 'Titanium USB-C Hub', stock: 2, price: 89, status: 'Critical' },
  ],
  invoices: [
    { id: 'i102', customer: 'Acme Corp', amount: 4200, status: 'Overdue', daysOverdue: 18 },
    { id: 'i104', customer: 'Nova Retail', amount: 1800, status: 'Unpaid', daysOverdue: 4 },
  ],
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'memory', label: 'Business Memory', icon: Brain },
  { id: 'kpi', label: 'AI Dashboards', icon: BarChart3 },
  { id: 'shadow', label: 'Shadow Employee', icon: Ghost },
  { id: 'simulator', label: 'Decision Simulator', icon: FlaskConical },
  { id: 'settings', label: 'Settings', icon: Settings },
]

const formatCurrency = (n) => `$${n.toLocaleString('en-US')}`

// ---------------- Toast System ----------------
function useToasts() {
  const [toasts, setToasts] = useState([])
  const push = (message, kind = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts((t) => [...t, { id, message, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }
  return { toasts, push }
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="animate-toast flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/95 backdrop-blur px-4 py-3 shadow-2xl min-w-[280px]">
          <div className="h-8 w-8 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-sm text-zinc-200">{t.message}</div>
        </div>
      ))}
    </div>
  )
}

// ---------------- Sidebar ----------------
function Sidebar({ activeTab, setActiveTab }) {
  return (
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 bg-zinc-950 flex flex-col">
      <div className="h-16 px-5 flex items-center gap-2.5 border-b border-zinc-800/80">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
          <Sparkles className="h-4 w-4 text-white" />
        </div>
        <div>
          <div className="text-[15px] font-semibold tracking-tight text-zinc-100">Sentinel AI</div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Chief of Staff</div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map((item) => {
          const Icon = item.icon
          const active = activeTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all ${
                active
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50 border border-transparent'
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-zinc-600" />}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800/80">
        <div className="rounded-lg border border-indigo-500/20 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 p-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <div className="text-xs font-semibold text-zinc-200">Pro Plan</div>
          </div>
          <div className="text-[11px] text-zinc-400 leading-relaxed">All AI agents active. Autopilot mode enabled.</div>
        </div>
      </div>
    </aside>
  )
}

// ---------------- Header ----------------
function Header({ company }) {
  return (
    <header className="h-16 shrink-0 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <div className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-100 leading-tight">{company.name}</div>
          <div className="text-[11px] text-zinc-500 flex items-center gap-1">
            <Activity className="h-3 w-3" /> Live · Synced 2 min ago
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400">
          <Command className="h-3.5 w-3.5" /> <span>K</span>
          <span className="text-zinc-600 ml-1">Ask Sentinel</span>
        </div>
        <button className="relative h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-900 transition">
          <Bell className="h-4 w-4 text-zinc-400" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
        </button>
        <div className="flex items-center gap-2.5 pl-3 border-l border-zinc-800">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-medium text-zinc-200 leading-tight">Zaara Chen</div>
            <div className="text-[10px] text-zinc-500">Google · zaara@apex.co</div>
          </div>
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 flex items-center justify-center text-sm font-semibold text-white ring-2 ring-zinc-800">Z</div>
        </div>
      </div>
    </header>
  )
}

// ---------------- Reusable UI ----------------
function Card({ children, className = '' }) {
  return (
    <div className={`rounded-xl border border-zinc-800/80 bg-zinc-900/40 ${className}`}>
      {children}
    </div>
  )
}

function StatPill({ delta, positive = true }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${
      positive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
               : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
    }`}>
      {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {delta}
    </div>
  )
}

function SectionTitle({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      {eyebrow && <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-medium mb-1.5">{eyebrow}</div>}
      <h2 className="text-xl font-semibold text-zinc-100 tracking-tight">{title}</h2>
      {description && <p className="text-sm text-zinc-500 mt-1">{description}</p>}
    </div>
  )
}

// ---------------- Health Ring ----------------
function HealthRing({ score, delta }) {
  const circumference = 2 * Math.PI * 52
  const offset = circumference - (score / 100) * circumference
  return (
    <div className="relative h-40 w-40">
      <svg className="transform -rotate-90" width="160" height="160">
        <circle cx="80" cy="80" r="52" stroke="#27272a" strokeWidth="10" fill="none" />
        <circle
          cx="80" cy="80" r="52"
          stroke="url(#healthGrad)"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.8s ease' }}
        />
        <defs>
          <linearGradient id="healthGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-bold text-zinc-100 tracking-tight tabular-nums">{score}</div>
        <div className="text-[10px] uppercase tracking-widest text-zinc-500">Health</div>
        <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
          <ArrowUpRight className="h-3 w-3" /> +{delta} pts
        </div>
      </div>
    </div>
  )
}

// ---------------- Dashboard View ----------------
function DashboardView({ company }) {
  const { healthScore, healthDelta, kpis, owner } = company

  return (
    <div className="animate-slide-in space-y-8">
      {/* Executive Briefing */}
      <div>
        <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-medium mb-2 flex items-center gap-2">
          <Sparkles className="h-3 w-3" /> Executive Briefing · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
        <h1 className="text-3xl font-semibold text-zinc-100 tracking-tight">
          Good Morning, {owner} <span className="inline-block">👋</span>
        </h1>
        <p className="text-zinc-400 mt-1.5 text-[15px]">Here is your AI Chief of Staff briefing.</p>
      </div>

      {/* Top row: Health + Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Health */}
        <Card className="p-6 lg:col-span-1">
          <div className="flex items-center justify-between mb-3">
            <div className="text-xs uppercase tracking-wider text-zinc-500 font-medium">Business Health</div>
            <div className="h-2 w-2 rounded-full bg-emerald-400 pulse-dot" />
          </div>
          <div className="flex items-center justify-center py-2">
            <HealthRing score={healthScore} delta={healthDelta} />
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800 text-xs text-zinc-500 text-center">
            Trending upward — cash flow strong, inventory needs attention.
          </div>
        </Card>

        {/* Priorities */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-4 w-4 text-indigo-400" />
            <div className="text-xs uppercase tracking-wider text-zinc-400 font-medium">Today's Priorities</div>
          </div>
          <div className="space-y-3">
            {[
              { n: 1, text: 'Remind Acme Corp about overdue balance.', tag: 'Finance', tagColor: 'rose' },
              { n: 2, text: 'Restock Titanium USB-C Hub.', tag: 'Inventory', tagColor: 'amber' },
            ].map((p) => (
              <div key={p.n} className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/70 hover:border-zinc-700 transition">
                <div className="h-6 w-6 rounded-md bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-[11px] font-semibold text-indigo-300 shrink-0">{p.n}</div>
                <div className="flex-1">
                  <div className="text-sm text-zinc-200">{p.text}</div>
                </div>
                <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded font-medium ${
                  p.tagColor === 'rose' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>{p.tag}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Risk + Opportunity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-rose-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-rose-400 font-semibold">Biggest Risk</div>
                <div className="text-sm text-zinc-300">Overdue Receivable</div>
              </div>
            </div>
            <p className="text-zinc-200 leading-relaxed">
              Acme Corp invoice is <span className="font-semibold text-rose-300">18 days overdue</span> ($4,200). Recommend automated dunning sequence.
            </p>
          </div>
        </Card>

        <Card className="p-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-8 w-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Lightbulb className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Biggest Opportunity</div>
                <div className="text-sm text-zinc-300">Cross-Sell Signal</div>
              </div>
            </div>
            <p className="text-zinc-200 leading-relaxed">
              Quantum Pro Headset sales velocity suggests cross-promoting to <span className="font-semibold text-emerald-300">Nova Retail</span>.
            </p>
          </div>
        </Card>
      </div>

      {/* AI Dashboards KPI Grid */}
      <div>
        <SectionTitle eyebrow="AI Dashboards" title="Live Business Metrics" description="Autonomously computed from your connected systems." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            icon={DollarSign}
            label="Revenue (MoM)"
            value={formatCurrency(kpis.revenue)}
            delta={`+${kpis.revenueDelta}%`}
            positive
            accent="emerald"
          />
          <KpiCard
            icon={Users}
            label="Active Customers"
            value={kpis.activeCustomers.toLocaleString()}
            delta="+8"
            positive
            accent="indigo"
          />
          <KpiCard
            icon={Package}
            label="Low Stock Alerts"
            value={kpis.lowStockAlerts}
            delta="Attention"
            positive={false}
            accent="amber"
          />
          <KpiCard
            icon={AlertTriangle}
            label="Overdue Invoices"
            value={formatCurrency(kpis.overdueTotal)}
            delta="2 open"
            positive={false}
            accent="rose"
          />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, delta, positive, accent = 'indigo' }) {
  const accents = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  }
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-9 w-9 rounded-lg border flex items-center justify-center ${accents[accent]}`}>
          <Icon className="h-4 w-4" />
        </div>
        <StatPill delta={delta} positive={positive} />
      </div>
      <div className="text-2xl font-semibold text-zinc-100 tracking-tight tabular-nums">{value}</div>
      <div className="text-xs text-zinc-500 mt-1">{label}</div>
    </Card>
  )
}

// ---------------- Business Memory / AI Search ----------------
function MemoryView({ company }) {
  const [query, setQuery] = useState('')
  const suggestions = [
    'Show unpaid invoices',
    'Why did sales change?',
    "What are today's priorities?",
  ]

  const lower = query.toLowerCase()
  const showInvoices = /invoice|unpaid|overdue/.test(lower)
  const showSales = /sales|priorit/.test(lower)

  return (
    <div className="animate-slide-in max-w-5xl">
      <SectionTitle
        eyebrow="Business Memory"
        title="Ask anything about your business"
        description="Sentinel indexes every invoice, order, customer, and message."
      />

      <Card className="p-2 mb-4 relative">
        <div className="flex items-center gap-3 px-3">
          <Search className="h-4 w-4 text-zinc-500 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Show me all customers with overdue balances..."
            className="flex-1 bg-transparent py-3 text-[15px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 rounded border border-zinc-800 bg-zinc-900 text-[10px] text-zinc-500">
            <Sparkles className="h-3 w-3 text-indigo-400" /> AI
          </div>
        </div>
      </Card>

      <div className="flex flex-wrap gap-2 mb-8">
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => setQuery(s)}
            className="px-3 py-1.5 rounded-full text-xs bg-zinc-900/60 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700 transition"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Results */}
      <div className="animate-slide-in" key={query}>
        {showInvoices && <InvoicesTable invoices={company.invoices} />}
        {!showInvoices && showSales && <SalesNarrative />}
        {!showInvoices && !showSales && <DefaultSummary company={company} />}
      </div>
    </div>
  )
}

function InvoicesTable({ invoices }) {
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
            <AlertTriangle className="h-3 w-3 text-rose-400" />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100">Unpaid Invoices</div>
            <div className="text-xs text-zinc-500">Filtered from Business Memory</div>
          </div>
        </div>
        <div className="text-xs text-zinc-500">{invoices.length} results</div>
      </div>
      <table className="w-full">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
            <th className="px-5 py-3 font-medium">Invoice</th>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium">Amount</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium">Days</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, i) => (
            <tr key={inv.id} className={`text-sm ${i < invoices.length - 1 ? 'border-b border-zinc-800/60' : ''}`}>
              <td className="px-5 py-4 font-mono text-zinc-400">#{inv.id}</td>
              <td className="px-5 py-4 text-zinc-200 font-medium">{inv.customer}</td>
              <td className="px-5 py-4 text-zinc-100 tabular-nums font-medium">{formatCurrency(inv.amount)}</td>
              <td className="px-5 py-4">
                <span className={`text-[11px] px-2 py-1 rounded-md font-medium border ${
                  inv.status === 'Overdue'
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>{inv.status}</span>
              </td>
              <td className="px-5 py-4 text-zinc-400 tabular-nums">{inv.daysOverdue}d</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  )
}

function SalesNarrative() {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-100">Sales Analysis</div>
          <div className="text-xs text-zinc-500">Generated by Sentinel · 30s ago</div>
        </div>
      </div>

      <div className="prose prose-invert prose-sm max-w-none space-y-4 text-zinc-300 leading-relaxed">
        <p>
          Revenue is up <span className="text-emerald-400 font-semibold">+12% month-over-month</span>, driven primarily by strong sell-through on the Quantum Pro Headset line and a 23% lift in repeat orders from your top-tier retail accounts.
        </p>
        <p>
          However, growth is being materially constrained by inventory. The <span className="text-rose-400 font-semibold">Titanium USB-C Hub</span> is down to 2 units (Critical), and forecasted demand suggests we are choking fulfillment by ~$11k in the coming 14 days.
        </p>
        <div className="mt-4 p-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
          <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold mb-1.5">Recommended Action</div>
          <div className="text-sm text-zinc-200">Trigger an emergency PO with your primary supplier for 200 units of the USB-C Hub, and initiate a cross-sell campaign for the Headset to Nova Retail — projected uplift +$18k this quarter.</div>
        </div>
      </div>
    </Card>
  )
}

function DefaultSummary({ company }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-md bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
          <Brain className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <div className="text-sm font-semibold text-zinc-100">Operations Summary</div>
          <div className="text-xs text-zinc-500">{company.name} · Last 30 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Revenue</div>
          <div className="text-lg font-semibold text-zinc-100 mt-0.5 tabular-nums">{formatCurrency(company.kpis.revenue)}</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">Customers</div>
          <div className="text-lg font-semibold text-zinc-100 mt-0.5 tabular-nums">{company.kpis.activeCustomers}</div>
        </div>
        <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800">
          <div className="text-[10px] uppercase tracking-wider text-zinc-500">AR Outstanding</div>
          <div className="text-lg font-semibold text-zinc-100 mt-0.5 tabular-nums">{formatCurrency(company.kpis.overdueTotal)}</div>
        </div>
      </div>

      <div className="space-y-3 text-sm text-zinc-300 leading-relaxed">
        <p>
          <span className="text-zinc-100 font-medium">{company.name}</span> is operating in a healthy growth regime. Revenue expanded 12% MoM, customer base grew steadily, and margins remain intact.
        </p>
        <p>
          Two active constraint vectors: (1) inventory stockouts on high-velocity SKUs, and (2) an aged receivable from Acme Corp requiring escalation. Zaara is actively drafting remediation for both.
        </p>
        <p className="text-zinc-500 text-xs pt-2 border-t border-zinc-800">
          Try asking: <span className="text-indigo-400">"Show unpaid invoices"</span> or <span className="text-indigo-400">"Why did sales change?"</span>
        </p>
      </div>
    </Card>
  )
}

// ---------------- AI Dashboards standalone (KPI view) ----------------
function KpiView({ company }) {
  return (
    <div className="animate-slide-in">
      <SectionTitle
        eyebrow="AI Dashboards"
        title="Autonomous Business Intelligence"
        description="Sentinel continuously monitors and surfaces every metric that matters."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={DollarSign} label="Revenue (MoM)" value={formatCurrency(company.kpis.revenue)} delta={`+${company.kpis.revenueDelta}%`} positive accent="emerald" />
        <KpiCard icon={Users} label="Active Customers" value={company.kpis.activeCustomers.toLocaleString()} delta="+8" positive accent="indigo" />
        <KpiCard icon={Package} label="Low Stock Alerts" value={company.kpis.lowStockAlerts} delta="Attention" positive={false} accent="amber" />
        <KpiCard icon={AlertTriangle} label="Overdue Invoices" value={formatCurrency(company.kpis.overdueTotal)} delta="2 open" positive={false} accent="rose" />
      </div>

      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-zinc-100">Inventory Snapshot</div>
            <div className="text-xs text-zinc-500">{company.inventory.length} SKUs tracked</div>
          </div>
          <Package className="h-4 w-4 text-zinc-500" />
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-zinc-500 border-b border-zinc-800">
              <th className="px-5 py-3 font-medium">Product</th>
              <th className="px-5 py-3 font-medium">Stock</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {company.inventory.map((p, i) => (
              <tr key={p.id} className={`text-sm ${i < company.inventory.length - 1 ? 'border-b border-zinc-800/60' : ''}`}>
                <td className="px-5 py-4 text-zinc-200 font-medium">{p.name}</td>
                <td className="px-5 py-4 text-zinc-300 tabular-nums">{p.stock}</td>
                <td className="px-5 py-4 text-zinc-300 tabular-nums">${p.price}</td>
                <td className="px-5 py-4">
                  <span className={`text-[11px] px-2 py-1 rounded-md font-medium border ${
                    p.status === 'Critical' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    : p.status === 'Low Stock' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>{p.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}

// ---------------- Shadow Employee ----------------
function ShadowView({ pushToast }) {
  const events = [
    {
      id: 'e1',
      kind: 'critical',
      time: '2m ago',
      icon: Package,
      title: 'Critical: Inventory alert for Titanium USB-C Hub',
      body: '2 remaining. Forecast demand exceeds supply within 3 days.',
      action: 'Order Stock',
      actionIcon: ShoppingCart,
      toast: '✓ Purchase order draft sent to supplier',
    },
    {
      id: 'e2',
      kind: 'warning',
      time: '18m ago',
      icon: Clock,
      title: 'Warning: Acme Corp balance is 18 days overdue',
      body: 'Outstanding: $4,200. Prior payment behavior indicates soft-touch reminder will suffice.',
      action: 'Draft Email',
      actionIcon: Mail,
      toast: '✓ Reminder email drafted for Acme Corp',
    },
    {
      id: 'e3',
      kind: 'info',
      time: '1h ago',
      icon: Users,
      title: 'Churn Risk: Nova Retail has not ordered in 24 days',
      body: 'Historical cadence is every 14 days. Suggest a re-engagement campaign.',
      action: 'Draft Outreach',
      actionIcon: Send,
      toast: '✓ Re-engagement outreach drafted for Nova Retail',
    },
  ]

  const styles = {
    critical: { chip: 'bg-rose-500/10 text-rose-400 border-rose-500/20', dot: 'bg-rose-500' },
    warning: { chip: 'bg-amber-500/10 text-amber-400 border-amber-500/20', dot: 'bg-amber-500' },
    info: { chip: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20', dot: 'bg-indigo-500' },
  }

  return (
    <div className="animate-slide-in">
      <SectionTitle
        eyebrow="Shadow Employee"
        title="Proactive Activity Timeline"
        description="Your 24/7 AI operator flagged the following in real time."
      />

      <div className="relative pl-6">
        <div className="absolute left-2 top-2 bottom-2 w-px bg-zinc-800" />
        <div className="space-y-4">
          {events.map((e) => {
            const Icon = e.icon
            const ActionIcon = e.actionIcon
            const s = styles[e.kind]
            return (
              <div key={e.id} className="relative">
                <div className={`absolute -left-[18px] top-4 h-3 w-3 rounded-full ${s.dot} ring-4 ring-zinc-950 pulse-dot`} />
                <Card className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`h-9 w-9 shrink-0 rounded-md border flex items-center justify-center ${s.chip}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] uppercase tracking-widest font-semibold px-1.5 py-0.5 rounded border ${s.chip}`}>{e.kind}</span>
                        <span className="text-[11px] text-zinc-500">{e.time}</span>
                      </div>
                      <div className="text-sm font-semibold text-zinc-100">{e.title}</div>
                      <div className="text-sm text-zinc-400 mt-1 leading-relaxed">{e.body}</div>
                    </div>
                    <button
                      onClick={() => pushToast(e.toast)}
                      className="shrink-0 inline-flex items-center gap-2 px-3 py-2 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition"
                    >
                      <ActionIcon className="h-3.5 w-3.5" />
                      {e.action}
                    </button>
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ---------------- Decision Simulator ----------------
function SimulatorView({ priceIncrease, setPriceIncrease, supplyOpt, setSupplyOpt, company, baseline }) {
  return (
    <div className="animate-slide-in">
      <SectionTitle
        eyebrow="Decision Simulator"
        title="Model strategic decisions in real time"
        description="Toggle scenarios to see projected impact on health score, revenue, and risk."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
        {/* Price Increase */}
        <Card className={`p-6 transition-all ${priceIncrease ? 'border-indigo-500/40 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">Simulate 5% Price Increase</div>
                <div className="text-xs text-zinc-500">Across all SKUs, effective next cycle</div>
              </div>
            </div>
            <Switch active={priceIncrease} onClick={() => setPriceIncrease(!priceIncrease)} />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">Apply a uniform 5% price lift across the catalog and observe forecasted P&L impact.</p>
        </Card>

        {/* Supply Chain */}
        <Card className={`p-6 transition-all ${supplyOpt ? 'border-indigo-500/40 shadow-[0_0_40px_-10px_rgba(99,102,241,0.4)]' : ''}`}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-violet-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">Simulate Supply Chain Optimization</div>
                <div className="text-xs text-zinc-500">Consolidate suppliers, tighten lead times</div>
              </div>
            </div>
            <Switch active={supplyOpt} onClick={() => setSupplyOpt(!supplyOpt)} />
          </div>
          <p className="text-sm text-zinc-400 leading-relaxed">Route inventory through a single tier-1 supplier — projected 22% lead time reduction.</p>
        </Card>
      </div>

      {/* Comparison Panel */}
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-indigo-400" />
            <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">Projected Outcome</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <CompareBox label="Health Score" baseline={baseline.healthScore} projected={company.healthScore} unit="" />
            <CompareBox label="Revenue" baseline={baseline.kpis.revenue} projected={company.kpis.revenue} unit="$" isCurrency />
            <CompareBox label="Overdue AR" baseline={baseline.kpis.overdueTotal} projected={company.kpis.overdueTotal} unit="$" isCurrency inverse />
          </div>

          <div className="p-5 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-emerald-300 mb-1">Sentinel Analysis</div>
                <div className="text-sm text-zinc-300 leading-relaxed">
                  {priceIncrease && supplyOpt
                    ? 'Compounded impact: projected margin expansion with reduced fulfillment risk. Both levers are additive — recommend staged rollout over 2 quarters.'
                    : priceIncrease
                    ? 'Projected margin increase with minimal attrition risk. Elasticity model shows <2% expected churn given current NPS and competitor pricing spread.'
                    : supplyOpt
                    ? 'Lead time reduction unlocks ~$12k in previously lost fulfillment. Health improves via reduced stockout risk.'
                    : 'Toggle a simulation above to model projected impact on your business.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

function Switch({ active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`relative h-7 w-12 rounded-full border transition-all ${
        active ? 'bg-indigo-500/80 border-indigo-400/50' : 'bg-zinc-800 border-zinc-700'
      }`}
    >
      <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all shadow ${
        active ? 'left-[22px]' : 'left-0.5'
      }`} />
    </button>
  )
}

function CompareBox({ label, baseline, projected, unit = '', isCurrency = false, inverse = false }) {
  const changed = baseline !== projected
  const fmt = (v) => isCurrency ? formatCurrency(v) : `${v}${unit}`
  const diff = projected - baseline
  const positive = inverse ? diff < 0 : diff > 0

  return (
    <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800">
      <div className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium mb-2">{label}</div>
      <div className="flex items-baseline gap-2">
        <div className={`text-xl font-semibold tabular-nums ${changed ? 'text-zinc-100' : 'text-zinc-400'}`}>
          {fmt(projected)}
        </div>
        {changed && (
          <div className={`text-[11px] font-medium ${positive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {diff > 0 ? '+' : ''}{isCurrency ? formatCurrency(diff) : diff}
          </div>
        )}
      </div>
      {changed && (
        <div className="text-[10px] text-zinc-600 mt-1 tabular-nums line-through">
          was {fmt(baseline)}
        </div>
      )}
    </div>
  )
}

// ---------------- Settings ----------------
function SettingsView() {
  return (
    <div className="animate-slide-in max-w-3xl">
      <SectionTitle eyebrow="Settings" title="Configuration" description="Manage integrations and preferences." />
      <div className="space-y-4">
        {[
          { name: 'QuickBooks', desc: 'Accounting sync · Last: 2 min ago', status: 'Connected' },
          { name: 'Shopify', desc: 'Order + inventory feed', status: 'Connected' },
          { name: 'Gmail', desc: 'Outreach + threads', status: 'Connected' },
          { name: 'Slack', desc: 'Alert routing', status: 'Not linked' },
        ].map((i) => (
          <Card key={i.name} className="p-5 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-zinc-100">{i.name}</div>
              <div className="text-xs text-zinc-500 mt-0.5">{i.desc}</div>
            </div>
            <span className={`text-[11px] px-2.5 py-1 rounded-md font-medium border ${
              i.status === 'Connected'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700'
            }`}>{i.status}</span>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ---------------- Main App ----------------
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [priceIncrease, setPriceIncrease] = useState(false)
  const [supplyOpt, setSupplyOpt] = useState(false)
  const { toasts, push } = useToasts()

  // Derive live company state from toggles
  const company = useMemo(() => {
    let c = JSON.parse(JSON.stringify(BASE_COMPANY))
    if (priceIncrease) {
      c.healthScore = 88
      c.kpis.revenue = 149625
      c.kpis.revenueDelta = 17
    }
    if (supplyOpt) {
      c.healthScore = Math.min(100, c.healthScore + 3)
      c.kpis.lowStockAlerts = 1
      c.kpis.overdueTotal = Math.max(0, c.kpis.overdueTotal - 1800)
    }
    return c
  }, [priceIncrease, supplyOpt])

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView company={company} />
      case 'memory': return <MemoryView company={company} />
      case 'kpi': return <KpiView company={company} />
      case 'shadow': return <ShadowView pushToast={push} />
      case 'simulator':
        return (
          <SimulatorView
            priceIncrease={priceIncrease}
            setPriceIncrease={setPriceIncrease}
            supplyOpt={supplyOpt}
            setSupplyOpt={setSupplyOpt}
            company={company}
            baseline={BASE_COMPANY}
          />
        )
      case 'settings': return <SettingsView />
      default: return <DashboardView company={company} />
    }
  }

  return (
    <div className="h-screen w-screen flex bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header company={company} />
        <main className="flex-1 overflow-y-auto grid-backdrop">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            {renderTab()}
          </div>
        </main>
      </div>
      <ToastStack toasts={toasts} />
    </div>
  )
}

export default App
