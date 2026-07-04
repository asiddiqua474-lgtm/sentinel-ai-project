'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  LayoutDashboard, Brain, BarChart3, Ghost, FlaskConical, Settings,
  TrendingUp, Users, AlertTriangle, IndianRupee, Search, Sparkles,
  ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, Clock,
  Package, Mail, ShoppingCart, Zap, Bell, ChevronRight, Send,
  Lightbulb, Target, Activity, Command, Phone, Facebook, Instagram,
  Sun, Moon, Star, Award, Shield, Rocket, X as XClose, Calendar
} from 'lucide-react'

// Custom social icons (X, WhatsApp)
const XIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)
const WhatsAppIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

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

const formatCurrency = (n) => `₹${n.toLocaleString('en-IN')}`

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
    <aside className="w-64 shrink-0 border-r border-zinc-800/80 sidebar-3d flex flex-col">
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
              className={`w-full group flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                active
                  ? 'bg-zinc-900 text-zinc-100 border border-zinc-800 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/60 hover:translate-x-0.5 border border-transparent hover:border-zinc-800'
              }`}
            >
              <Icon className={`h-4 w-4 transition-colors ${active ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-indigo-400'}`} />
              <span className="font-medium">{item.label}</span>
              {active && <ChevronRight className="h-3.5 w-3.5 ml-auto text-zinc-600" />}
            </button>
          )
        })}
      </nav>

      <div className="p-3 border-t border-zinc-800/80 space-y-3">
        {/* Contact card */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <div className="text-xs font-semibold text-zinc-200">Contact Support</div>
          </div>
          <a href="tel:+918688046155" className="flex items-center gap-2 text-[11px] text-zinc-400 hover:text-emerald-400 transition group">
            <div className="h-6 w-6 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 transition">
              <Phone className="h-3 w-3 text-emerald-400" />
            </div>
            <span className="tabular-nums font-medium">+91 86880 46155</span>
          </a>
        </div>

        {/* Social row */}
        <div className="flex items-center justify-between gap-1.5">
          <a href="#" title="Facebook" className="flex-1 h-8 rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:scale-105 transition-all">
            <Facebook className="h-3.5 w-3.5" />
          </a>
          <a href="#" title="X (Twitter)" className="flex-1 h-8 rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-100 hover:text-black hover:border-zinc-100 hover:scale-105 transition-all">
            <XIcon className="h-3 w-3" />
          </a>
          <a href="#" title="Instagram" className="flex-1 h-8 rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gradient-to-br hover:from-fuchsia-500 hover:via-rose-500 hover:to-amber-500 hover:border-transparent hover:scale-105 transition-all">
            <Instagram className="h-3.5 w-3.5" />
          </a>
          <a href="https://wa.me/918688046155" target="_blank" rel="noreferrer" title="WhatsApp" className="flex-1 h-8 rounded-md border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 hover:scale-105 transition-all">
            <WhatsAppIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </aside>
  )
}

// ---------------- Header ----------------
function Header({ company, theme, setTheme, onOpenAsk }) {
  const [notifOpen, setNotifOpen] = useState(false)
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
        <button
          onClick={onOpenAsk}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md border border-zinc-800 bg-zinc-900/50 text-xs text-zinc-400 hover:border-indigo-500/50 hover:bg-indigo-500/5 hover:text-zinc-200 transition-all group"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400 group-hover:animate-pulse" />
          <span className="text-zinc-500 mr-2">Ask Sentinel</span>
          <kbd className="px-1 py-0 rounded bg-zinc-800 border border-zinc-700 text-[10px] text-zinc-400">⌘K</kbd>
        </button>
        <button
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-xs font-semibold shadow-lg shadow-indigo-500/30 hover:scale-105 transition-all"
        >
          <Calendar className="h-3.5 w-3.5" /> Book Demo
        </button>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          title="Toggle theme"
          className="h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-900 hover:scale-110 hover:border-indigo-500/40 transition-all group"
        >
          {theme === 'dark' ? (
            <Sun className="h-4 w-4 text-amber-400 group-hover:rotate-45 transition-transform duration-500" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-400 group-hover:-rotate-12 transition-transform duration-500" />
          )}
        </button>
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative h-9 w-9 rounded-md border border-zinc-800 bg-zinc-900/50 flex items-center justify-center hover:bg-zinc-900 transition"
          >
            <Bell className="h-4 w-4 text-zinc-400" />
            <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
          <NotificationsPopover open={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>
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
function Card({ children, className = '', interactive = true, is3D = true }) {
  return (
    <div className={`rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition-all duration-300 ${
      is3D ? 'card-3d' : ''
    } ${interactive && !is3D ? 'hover:border-zinc-700 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-indigo-500/5 hover:-translate-y-0.5' : ''} ${className}`}>
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

function GradientBanner({ from, via, to, icon: Icon, title, subtitle }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl p-6 mb-6 border border-zinc-800/80 bg-gradient-to-br ${from} ${via || ''} ${to} animate-gradient`}>
      <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
      <div className="relative flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-2xl">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
          <p className="text-sm text-white/80 mt-1">{subtitle}</p>
        </div>
      </div>
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
      {/* Executive Briefing Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-zinc-800/80 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 animate-gradient">
        <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-amber-400/20 blur-3xl" />
        <div className="absolute inset-0 grid-backdrop opacity-30" />
        <div className="relative">
          <div className="text-[11px] uppercase tracking-widest text-white/80 font-medium mb-3 flex items-center gap-2">
            <Sparkles className="h-3 w-3" /> Executive Briefing · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Good Morning, {owner} <span className="inline-block animate-pulse">👋</span>
          </h1>
          <p className="text-white/85 mt-2 text-[15px]">Here is your AI Chief of Staff briefing.</p>
        </div>
      </div>

      {/* Trust Bar */}
      <TrustBar />

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
              Acme Corp invoice is <span className="font-semibold text-rose-300">18 days overdue</span> (₹4,200). Recommend automated dunning sequence.
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
            icon={IndianRupee}
            label="Revenue (MoM)"
            value={formatCurrency(kpis.revenue)}
            delta={`+${kpis.revenueDelta}%`}
            positive
            accent="emerald"
            spark={[110, 115, 108, 122, 128, 132, 138, 142]}
          />
          <KpiCard
            icon={Users}
            label="Active Customers"
            value={kpis.activeCustomers.toLocaleString()}
            delta="+8"
            positive
            accent="indigo"
            spark={[310, 315, 320, 322, 328, 334, 338, 342]}
          />
          <KpiCard
            icon={Package}
            label="Low Stock Alerts"
            value={kpis.lowStockAlerts}
            delta="Attention"
            positive={false}
            accent="amber"
            spark={[1, 1, 2, 2, 3, 3, 3, 3]}
          />
          <KpiCard
            icon={AlertTriangle}
            label="Overdue Invoices"
            value={formatCurrency(kpis.overdueTotal)}
            delta="2 open"
            positive={false}
            accent="rose"
            spark={[2000, 3200, 4500, 5800, 6200, 7400, 8100, 8400]}
          />
        </div>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, label, value, delta, positive, accent = 'indigo', spark }) {
  const accents = {
    emerald: { pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:bg-emerald-500/20 group-hover:shadow-lg group-hover:shadow-emerald-500/20', color: '#10b981' },
    indigo: { pill: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:shadow-lg group-hover:shadow-indigo-500/20', color: '#6366f1' },
    amber: { pill: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:bg-amber-500/20 group-hover:shadow-lg group-hover:shadow-amber-500/20', color: '#f59e0b' },
    rose: { pill: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:bg-rose-500/20 group-hover:shadow-lg group-hover:shadow-rose-500/20', color: '#f43f5e' },
  }
  const a = accents[accent]
  return (
    <Card className="p-5 group cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <div className={`h-9 w-9 rounded-lg border flex items-center justify-center transition-all duration-300 ${a.pill}`}>
          <Icon className="h-4 w-4" />
        </div>
        <StatPill delta={delta} positive={positive} />
      </div>
      <div className="text-2xl font-semibold text-zinc-100 tracking-tight tabular-nums group-hover:text-white transition-colors">{value}</div>
      <div className="flex items-end justify-between mt-1">
        <div className="text-xs text-zinc-500 group-hover:text-zinc-400 transition-colors">{label}</div>
        {spark && <Sparkline points={spark} color={a.color} />}
      </div>
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
      <GradientBanner
        from="from-indigo-600" via="via-violet-600" to="to-fuchsia-600"
        icon={Brain}
        title="Business Memory"
        subtitle="Ask anything — Sentinel has indexed every invoice, order, and message."
      />

      <Card className="p-2 mb-4 relative" is3D={false}>
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
          However, growth is being materially constrained by inventory. The <span className="text-rose-400 font-semibold">Titanium USB-C Hub</span> is down to 2 units (Critical), and forecasted demand suggests we are choking fulfillment by ~₹11,000 in the coming 14 days.
        </p>
        <div className="mt-4 p-4 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
          <div className="text-[11px] uppercase tracking-widest text-indigo-400 font-semibold mb-1.5">Recommended Action</div>
          <div className="text-sm text-zinc-200">Trigger an emergency PO with your primary supplier for 200 units of the USB-C Hub, and initiate a cross-sell campaign for the Headset to Nova Retail — projected uplift +₹18,000 this quarter.</div>
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
      <GradientBanner
        from="from-emerald-600" via="via-teal-600" to="to-cyan-600"
        icon={BarChart3}
        title="AI Dashboards"
        subtitle="Autonomous business intelligence — every metric that matters, live."
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard icon={IndianRupee} label="Revenue (MoM)" value={formatCurrency(company.kpis.revenue)} delta={`+${company.kpis.revenueDelta}%`} positive accent="emerald" spark={[110, 115, 108, 122, 128, 132, 138, 142]} />
        <KpiCard icon={Users} label="Active Customers" value={company.kpis.activeCustomers.toLocaleString()} delta="+8" positive accent="indigo" spark={[310, 315, 320, 322, 328, 334, 338, 342]} />
        <KpiCard icon={Package} label="Low Stock Alerts" value={company.kpis.lowStockAlerts} delta="Attention" positive={false} accent="amber" spark={[1, 1, 2, 2, 3, 3, 3, 3]} />
        <KpiCard icon={AlertTriangle} label="Overdue Invoices" value={formatCurrency(company.kpis.overdueTotal)} delta="2 open" positive={false} accent="rose" spark={[2000, 3200, 4500, 5800, 6200, 7400, 8100, 8400]} />
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
                <td className="px-5 py-4 text-zinc-300 tabular-nums">₹{p.price}</td>
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
      body: 'Outstanding: ₹4,200. Prior payment behavior indicates soft-touch reminder will suffice.',
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
      <GradientBanner
        from="from-rose-600" via="via-pink-600" to="to-orange-500"
        icon={Ghost}
        title="Shadow Employee"
        subtitle="Your 24/7 AI operator — proactive alerts, drafted actions, real time."
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
      <GradientBanner
        from="from-violet-600" via="via-purple-600" to="to-indigo-600"
        icon={FlaskConical}
        title="Decision Simulator"
        subtitle="Model strategic decisions in real time — see the impact before you commit."
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
                    ? 'Lead time reduction unlocks ~₹12,000 in previously lost fulfillment. Health improves via reduced stockout risk.'
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
// ---------------- Settings ----------------
function BusinessFooter() {
  return (
    <footer className="border-t border-zinc-800/80 bg-zinc-950/80 backdrop-blur mt-8">
      <div className="max-w-[1400px] mx-auto px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">Sentinel AI</div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Chief of Staff</div>
              </div>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              India's most trusted AI Chief of Staff for growing businesses. Automate ops, unlock insight, ship faster.
            </p>
          </div>

          {/* Company */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Company</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {['About Us', 'Careers', 'Press Kit', 'Partners'].map((x) => (
                <li key={x}>
                  <a href="#" className="hover:text-indigo-400 transition inline-flex items-center gap-1 group">
                    {x}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Business */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Business</div>
            <ul className="space-y-2 text-sm text-zinc-400">
              {['Pricing', 'Enterprise', 'Integrations', 'Case Studies'].map((x) => (
                <li key={x}>
                  <a href="#" className="hover:text-indigo-400 transition inline-flex items-center gap-1 group">
                    {x}
                    <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="text-[11px] uppercase tracking-widest text-zinc-500 font-semibold mb-3">Get in Touch</div>
            <a href="tel:+918688046155" className="flex items-center gap-2.5 text-sm text-zinc-300 hover:text-emerald-400 transition group mb-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:bg-emerald-500/20 group-hover:scale-105 transition-all">
                <Phone className="h-3.5 w-3.5 text-emerald-400" />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 uppercase tracking-wider">Sales & Support</div>
                <div className="text-sm font-semibold tabular-nums">+91 86880 46155</div>
              </div>
            </a>

            {/* UPI Payment */}
            <div className="rounded-xl border border-zinc-800/80 bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-fuchsia-500/5 p-3 mb-3 group hover:border-indigo-500/40 transition-all">
              <div className="flex items-center gap-3">
                <div className="h-16 w-16 rounded-lg bg-white p-1.5 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi%3A%2F%2Fpay%3Fpa%3Dtabrez116%40ibl%26pn%3DSentinel%2520AI%26cu%3DINR&margin=0"
                    alt="UPI QR Code — tabrez116@ibl"
                    className="h-full w-full"
                  />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-indigo-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1">
                    <Zap className="h-3 w-3" /> Pay via UPI
                  </div>
                  <div className="text-xs text-zinc-300 font-mono truncate">tabrez116@ibl</div>
                  <button
                    onClick={() => { navigator.clipboard?.writeText('tabrez116@ibl') }}
                    className="mt-1 text-[10px] px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition"
                  >
                    Copy UPI ID
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mt-4">
              <a href="#" title="Facebook" className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 hover:scale-110 hover:-translate-y-0.5 transition-all">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" title="X (Twitter)" className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-black hover:bg-white hover:border-white hover:scale-110 hover:-translate-y-0.5 transition-all">
                <XIcon className="h-3.5 w-3.5" />
              </a>
              <a href="#" title="Instagram" className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-gradient-to-br hover:from-fuchsia-500 hover:via-rose-500 hover:to-amber-500 hover:border-transparent hover:scale-110 hover:-translate-y-0.5 transition-all">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="https://wa.me/918688046155" target="_blank" rel="noreferrer" title="WhatsApp" className="h-9 w-9 rounded-lg border border-zinc-800 bg-zinc-900/60 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-emerald-600 hover:border-emerald-500 hover:scale-110 hover:-translate-y-0.5 transition-all">
                <WhatsAppIcon className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-5 border-t border-zinc-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-xs text-zinc-500">© 2025 Sentinel AI · Apex Electronics LLC · All rights reserved.</div>
          <div className="flex items-center gap-4 text-xs text-zinc-500">
            <a href="#" className="hover:text-zinc-300 transition">Privacy</a>
            <a href="#" className="hover:text-zinc-300 transition">Terms</a>
            <a href="#" className="hover:text-zinc-300 transition">Security</a>
            <div className="flex items-center gap-1.5 pl-3 border-l border-zinc-800">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 pulse-dot" />
              <span>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function SettingsView() {
  const integrations = [
    { name: 'QuickBooks', desc: 'Accounting sync · Last: 2 min ago', status: 'Connected', color: 'emerald', letter: 'Q' },
    { name: 'Shopify', desc: 'Order + inventory feed', status: 'Connected', color: 'emerald', letter: 'S' },
    { name: 'Gmail', desc: 'Outreach + threads', status: 'Connected', color: 'rose', letter: 'G' },
    { name: 'Slack', desc: 'Alert routing', status: 'Not linked', color: 'indigo', letter: '#' },
    { name: 'WhatsApp Business', desc: 'Customer messaging', status: 'Connected', color: 'emerald', letter: 'W' },
    { name: 'Razorpay', desc: 'Payment gateway (India)', status: 'Connected', color: 'blue', letter: 'R' },
  ]
  const colors = {
    emerald: 'from-emerald-500 to-teal-500',
    rose: 'from-rose-500 to-orange-500',
    indigo: 'from-indigo-500 to-violet-500',
    blue: 'from-blue-500 to-cyan-500',
  }
  return (
    <div className="animate-slide-in max-w-4xl">
      <GradientBanner
        from="from-zinc-700" via="via-slate-600" to="to-zinc-800"
        icon={Settings}
        title="Settings & Integrations"
        subtitle="Manage your connected systems, preferences, and workspace."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((i) => (
          <Card key={i.name} className="p-5 flex items-center justify-between group cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${colors[i.color]} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all`}>
                {i.letter}
              </div>
              <div>
                <div className="text-sm font-semibold text-zinc-100">{i.name}</div>
                <div className="text-xs text-zinc-500 mt-0.5">{i.desc}</div>
              </div>
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

// ---------------- Ask Sentinel (Command Palette / AI Chat) ----------------
function AskSentinel({ open, onClose }) {
  const [q, setQ] = useState('')
  const [messages, setMessages] = useState([])
  const [typing, setTyping] = useState(false)

  const smartAnswer = (query) => {
    const l = query.toLowerCase()
    if (/invoice|overdue|unpaid|receivable|payment/.test(l)) {
      return `You have 2 unpaid invoices totalling ₹6,000.\n\n• Acme Corp — ₹4,200 (18 days overdue) — HIGH priority\n• Nova Retail — ₹1,800 (4 days overdue)\n\nI've drafted a soft-touch reminder for Acme Corp. Want me to send it?`
    }
    if (/stock|inventory|restock|supplier/.test(l)) {
      return `Two SKUs need attention:\n\n• Titanium USB-C Hub — 2 units left (CRITICAL)\n• Quantum Pro Headset — 4 units (Low)\n\nRecommended: place an emergency PO for 200 USB-C Hubs (₹8,900) and a routine restock of 30 Headsets (₹26,910). Total: ₹35,810.`
    }
    if (/revenue|sales|growth|money/.test(l)) {
      return `Revenue this month: ₹1,42,500 — up 12% MoM.\n\nInventory stockouts on the USB-C Hub are capping upside by ~₹11,000. Clear that constraint and next-month projection reaches ₹1,58,000+.`
    }
    if (/customer|churn|nova|acme|retention/.test(l)) {
      return `You have 342 active customers.\n\nTwo need immediate attention:\n• Acme Corp — payment 18 days overdue\n• Nova Retail — churn risk (24 days since last order, historical cadence is 14 days)\n\nI can draft personalized outreach for both.`
    }
    if (/priorit|today|focus|agenda/.test(l)) {
      return `Your top 3 priorities today:\n\n1. Remind Acme Corp about their overdue ₹4,200 balance\n2. Restock the Titanium USB-C Hub (critical)\n3. Re-engage Nova Retail before churn hardens`
    }
    if (/health|score|overall|summary/.test(l)) {
      return `Business Health: 84/100 (+3 pts this week) — TRENDING UP.\n\n• Cash flow: strong\n• Revenue growth: +12% MoM\n• Main constraint: inventory stockouts on high-velocity SKUs\n• Risk: 1 aged receivable (Acme Corp)\n\nOverall — you're operating in a healthy growth regime.`
    }
    if (/simulat|forecast|scenario|what if/.test(l)) {
      return `You can run scenarios in the Decision Simulator tab. Currently modelled:\n\n• 5% Price Increase → Health 88, Revenue ₹1,49,625 (+₹7,125)\n• Supply Chain Optimization → Lead time -22%, ~₹12,000 recovered from lost fulfillment\n\nCombined: additive impact with margin expansion + reduced fulfillment risk.`
    }
    if (/hello|hi|hey/.test(l)) {
      return `Hello Zaara! I'm Sentinel — your AI Chief of Staff. I've been monitoring Apex Electronics 24/7. Ask me about invoices, inventory, revenue, customers, priorities, or run "what-if" scenarios.`
    }
    return `I've analyzed your business across every connected system. Try asking about:\n\n• Invoices & payments\n• Inventory & stockouts\n• Revenue & growth\n• Customers & churn\n• Today's priorities\n• Health score\n\nI can also draft emails, place orders, and simulate strategic decisions.`
  }

  const submit = () => {
    if (!q.trim()) return
    const query = q
    setMessages((m) => [...m, { role: 'user', text: query }])
    setQ('')
    setTyping(true)
    setTimeout(() => {
      setMessages((m) => [...m, { role: 'ai', text: smartAnswer(query) }])
      setTyping(false)
    }, 650)
  }

  if (!open) return null

  const suggestions = [
    "What are today's priorities?",
    'Show unpaid invoices',
    'How is revenue trending?',
    'Which customers might churn?',
    'What if I raise prices 5%?',
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/70 backdrop-blur-sm animate-slide-in" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl mx-4 rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden card-3d">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-fuchsia-500/10">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Ask Sentinel
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium">AI · LIVE</span>
            </div>
            <div className="text-[11px] text-zinc-500">Your AI Chief of Staff · trained on your business</div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-md bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-zinc-100 transition">
            <XClose className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[400px] overflow-y-auto p-5 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-4">
              <div className="text-sm text-zinc-400 mb-4">Ask anything about Apex Electronics</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setQ(s); setTimeout(() => document.getElementById('ask-input')?.focus(), 0) }}
                    className="text-xs px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-indigo-300 hover:border-indigo-500/50 hover:bg-indigo-500/10 transition"
                  >{s}</button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : ''}`}>
              {m.role === 'ai' && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0 glow-indigo">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-indigo-500 to-violet-600 text-white'
                  : 'bg-zinc-800/80 text-zinc-100 border border-zinc-700'
              }`}>{m.text}</div>
            </div>
          ))}
          {typing && (
            <div className="flex gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center glow-indigo">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="bg-zinc-800/80 border border-zinc-700 px-4 py-3 rounded-2xl flex gap-1 items-center">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.15s' }} />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <input
              id="ask-input"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
              autoFocus
              placeholder="Ask about invoices, inventory, revenue…"
              className="flex-1 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition"
            />
            <button
              onClick={submit}
              className="h-10 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white text-sm font-medium flex items-center gap-1.5 shadow-lg shadow-indigo-500/30 transition"
            >
              <Send className="h-3.5 w-3.5" /> Send
            </button>
          </div>
          <div className="text-[10px] text-zinc-500 mt-2 flex items-center gap-3">
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[9px]">Enter</kbd> to send</span>
            <span className="flex items-center gap-1"><kbd className="px-1 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-[9px]">Esc</kbd> to close</span>
            <span className="ml-auto text-emerald-400">● Connected</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// ---------------- Sparkline ----------------
function Sparkline({ points, color = '#6366f1', height = 32, width = 90 }) {
  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1
  const step = width / (points.length - 1)
  const coords = points.map((p, i) => [i * step, height - ((p - min) / range) * height])
  const pathD = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`
  const last = coords[coords.length - 1]
  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#spark-${color})`} />
      <path d={pathD} stroke={color} strokeWidth="1.75" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r="3" fill={color} />
      <circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.2" />
    </svg>
  )
}

// ---------------- Notifications Popover ----------------
function NotificationsPopover({ open, onClose }) {
  if (!open) return null
  const items = [
    { title: 'USB-C Hub critical stock', time: '2m', color: 'rose' },
    { title: 'Acme Corp reminder drafted', time: '18m', color: 'amber' },
    { title: 'Nova Retail churn risk detected', time: '1h', color: 'indigo' },
    { title: '₹4,200 flagged as recoverable', time: '3h', color: 'emerald' },
  ]
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-11 z-50 w-80 rounded-xl border border-zinc-800 bg-zinc-900 shadow-2xl overflow-hidden animate-slide-in">
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-violet-500/10">
          <div className="text-sm font-semibold text-zinc-100">Notifications</div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 font-medium">4 new</span>
        </div>
        <div className="max-h-72 overflow-y-auto">
          {items.map((n, i) => (
            <div key={i} className="px-4 py-3 border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 transition cursor-pointer flex items-start gap-3">
              <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                n.color === 'rose' ? 'bg-rose-500' : n.color === 'amber' ? 'bg-amber-500' : n.color === 'indigo' ? 'bg-indigo-500' : 'bg-emerald-500'
              } pulse-dot`} />
              <div className="flex-1 min-w-0">
                <div className="text-xs text-zinc-200">{n.title}</div>
                <div className="text-[10px] text-zinc-500 mt-0.5">{n.time} ago</div>
              </div>
            </div>
          ))}
        </div>
        <div className="px-4 py-2 border-t border-zinc-800 text-center">
          <button className="text-xs text-indigo-400 hover:text-indigo-300">View all activity →</button>
        </div>
      </div>
    </>
  )
}

// ---------------- Trust Bar ----------------
function TrustBar() {
  const stats = [
    { icon: Users, label: '2,400+ SMBs', sub: 'Trust Sentinel', color: 'text-indigo-400' },
    { icon: Star, label: '4.9/5 rating', sub: 'From 800+ reviews', color: 'text-amber-400' },
    { icon: Shield, label: 'ISO 27001', sub: 'Enterprise-grade security', color: 'text-emerald-400' },
    { icon: Rocket, label: '20+ hrs/week', sub: 'Saved per business', color: 'text-rose-400' },
  ]
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon
        return (
          <Card key={i} className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-zinc-900/80 border border-zinc-800 flex items-center justify-center">
              <Icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div>
              <div className="text-sm font-semibold text-zinc-100">{s.label}</div>
              <div className="text-[11px] text-zinc-500">{s.sub}</div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}

// ---------------- Main App ----------------
function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [priceIncrease, setPriceIncrease] = useState(false)
  const [supplyOpt, setSupplyOpt] = useState(false)
  const [theme, setTheme] = useState('dark')
  const [askOpen, setAskOpen] = useState(false)
  const { toasts, push } = useToasts()

  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setAskOpen((v) => !v)
      }
      if (e.key === 'Escape') setAskOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

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
    <div className={`h-screen w-screen flex bg-zinc-950 text-zinc-100 overflow-hidden ${theme === 'light' ? 'light-mode' : ''}`}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header company={company} theme={theme} setTheme={setTheme} onOpenAsk={() => setAskOpen(true)} />
        <main className="flex-1 overflow-y-auto grid-backdrop">
          <div className="max-w-[1400px] mx-auto px-8 py-8">
            {renderTab()}
          </div>
          <BusinessFooter />
        </main>
      </div>
      <ToastStack toasts={toasts} />
      <AskSentinel open={askOpen} onClose={() => setAskOpen(false)} />
    </div>
  )
}

export default App
