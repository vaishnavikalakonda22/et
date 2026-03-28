import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, FileText, Target, TrendingUp, LogOut,
  RefreshCw, Loader2, AlertTriangle, CheckCircle2, Zap,
  DollarSign, CreditCard, PiggyBank, Wallet, ShieldCheck,
  ChevronRight, Bot, Calculator, Landmark, Shield, TrendingDown,
  Activity, Compass, Crosshair, LineChart, Wand2, Info, Microscope, FileSearch, UploadCloud, PieChart
} from 'lucide-react'
import { getSession, logout } from '../utils/auth'
import { getFinanceData, saveFinanceData, calculateHealthScore, generateFinancialPlan, calculateGoalPlan, formatCurrency, calculateTax } from '../utils/finance'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts'
import ChatAssistant from '@/components/ChatAssistant'
import Logo from '@/components/Logo'

const TABS = [
  { id: 'Overview', label: 'Overview', icon: Activity },
  { id: 'Financial Plan', label: 'Financial Plan', icon: Compass },
  { id: 'Goal Planner', label: 'Goal Planner', icon: Crosshair },
  { id: 'Investments', label: 'Investments', icon: LineChart },
  { id: 'Tax Wizard', label: 'Tax Wizard', icon: Wand2 },
  { id: 'Portfolio X-Ray', label: 'Portfolio X-Ray', icon: Microscope },
]

const GOALS = ['Emergency Fund', 'House / Property', 'Retirement', 'Education', 'Travel / Vacation', 'Business / Startup', 'Vehicle', 'Other']

const LOADING_STEPS = [
  'Analyzing 6-dimension health profile...',
  'Calculating your health score...',
  'Generating AI recommendations...',
  'Crafting your financial plan...',
]

function LoadingScreen() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % LOADING_STEPS.length), 900)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950">
      <div className="text-center space-y-6">
        <div className="relative w-20 h-20 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-slate-800" />
          <div className="absolute inset-0 rounded-full border-2 border-t-sky-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="w-8 h-8 text-sky-400" />
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-slate-200 font-semibold text-lg">{LOADING_STEPS[step]}</p>
          <div className="flex items-center justify-center gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-sky-400" style={{ animation: `typing-bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ConfettiEffect() {
  useEffect(() => {
    import('canvas-confetti').then(m => {
      const confetti = m.default
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#0ea5e9', '#38bdf8', '#818cf8', '#f5c842'] })
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 } }), 400)
    })
  }, [])
  return null
}

function ScoreRing({ score, label, color }) {
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (score / 100) * circumference

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
          <circle
            cx="80" cy="80" r={radius} fill="none"
            stroke={color} strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="score-ring drop-shadow-lg"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-black text-white">{score}</span>
          <span className="text-xs font-bold uppercase tracking-wider mt-1" style={{ color }}>{label}</span>
        </div>
      </div>
    </div>
  )
}

function InfoTooltip({ text }) {
  return (
    <div className="relative group inline-flex items-center ml-1.5 align-middle">
      <Info className="w-3.5 h-3.5 text-slate-500 cursor-help hover:text-sky-400 transition-colors" />
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-56 p-2.5 bg-slate-800 text-xs font-medium text-slate-200 rounded-lg shadow-xl shadow-black/50 border border-slate-700 z-50 normal-case tracking-normal text-left">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const navigate = useNavigate()
  const user = getSession()

  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [user?.id, navigate])

  const [activeTab, setActiveTab] = useState('Overview')
  const [showLoading, setShowLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Expanded Finance Form for 6-Dimension Health Score
  const [financeForm, setFinanceForm] = useState({
    income: '', expenses: '', savings: '', emis: '', 
    healthInsurance: 'Yes', lifeInsurance: 'No', 
    investingForRetirement: 'No', utilizingTax80c: 'No',
    goal: 'Emergency Fund', risk: 'Medium',
  })
  const [formErrors, setFormErrors] = useState({})
  const [financeData, setFinanceData] = useState(null)
  const [healthScore, setHealthScore] = useState(null)
  const [plan, setPlan] = useState(null)

  const [goalForm, setGoalForm] = useState({ goalType: 'House / Property', targetAmount: '', months: '36' })
  const [goalResult, setGoalResult] = useState(null)

  // Tax Wizard Form
  const [taxForm, setTaxForm] = useState({
    baseSalary: '', hraReceived: '', monthlyRent: '', deduction80c: '150000', deduction80d: '25000', homeLoanInt: ''
  })
  const [taxResult, setTaxResult] = useState(null)

  // Portfolio X-Ray
  const [xrayState, setXrayState] = useState('idle') // idle, scanning, result
  const [dragActive, setDragActive] = useState(false)

  const handleXrayScan = () => {
    setXrayState('scanning')
    setTimeout(() => {
      setXrayState('result')
    }, 2500)
  }

  useEffect(() => {
    if (!user) return
    const saved = getFinanceData(user.id)
    if (saved) {
      setFinanceForm(saved.form)
      setFinanceData(saved)
      setFormSubmitted(true)
      
      const payload = { ...saved.form, healthInsurance: saved.form.healthInsurance === 'Yes', lifeInsurance: saved.form.lifeInsurance === 'Yes', investingForRetirement: saved.form.investingForRetirement === 'Yes', utilizingTax80c: saved.form.utilizingTax80c === 'Yes' }
      setHealthScore(calculateHealthScore(payload))
      setPlan(generateFinancialPlan(+saved.form.income, +saved.form.expenses, +saved.form.savings, saved.form.risk, saved.form.goal))
    }
  }, [user?.id])

  const handleFormChange = (name, value) => {
    setFinanceForm(f => ({ ...f, [name]: value }))
    setFormErrors(er => ({ ...er, [name]: '' }))
  }

  const handleTaxFormChange = (name, value) => {
    setTaxForm(f => ({ ...f, [name]: value }))
  }

  const validateForm = () => {
    const e = {}
    if (!financeForm.income || +financeForm.income <= 0) e.income = 'Enter a valid income'
    if (!financeForm.expenses || +financeForm.expenses < 0) e.expenses = 'Enter valid expenses'
    if (+financeForm.expenses >= +financeForm.income) e.expenses = 'Expenses must be less than income'
    if (!financeForm.savings && financeForm.savings !== '0') e.savings = 'Required (0 if none)'
    if (!financeForm.emis && financeForm.emis !== '0') e.emis = 'Required (0 if none)'
    return e
  }

  const handleAnalyze = async () => {
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setShowLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setShowLoading(false)

    const income = +financeForm.income
    const expenses = +financeForm.expenses
    const savings = +financeForm.savings || 0

    const payload = { ...financeForm, healthInsurance: financeForm.healthInsurance === 'Yes', lifeInsurance: financeForm.lifeInsurance === 'Yes', investingForRetirement: financeForm.investingForRetirement === 'Yes', utilizingTax80c: financeForm.utilizingTax80c === 'Yes' }
    
    const hs = calculateHealthScore(payload)
    const p = generateFinancialPlan(income, expenses, savings, financeForm.risk, financeForm.goal)

    const data = { form: financeForm, analyzedAt: new Date().toISOString() }
    saveFinanceData(user.id, data)
    setFinanceData(data)
    setHealthScore(hs)
    setPlan(p)
    setFormSubmitted(true)

    if (hs.tier === 'good') setTimeout(() => setShowConfetti(true), 100)
    setActiveTab('Overview')
  }

  const handleGoalCalc = () => {
    if (!goalForm.targetAmount || +goalForm.targetAmount <= 0 || !goalForm.months || +goalForm.months <= 0) return
    const result = calculateGoalPlan(goalForm.goalType, +goalForm.targetAmount, +goalForm.months, +financeForm.savings || 0)
    setGoalResult(result)
  }

  const handleTaxCalc = () => {
    const result = calculateTax(+taxForm.baseSalary||0, +taxForm.hraReceived||0, +taxForm.monthlyRent||0, +taxForm.deduction80c||0, +taxForm.deduction80d||0, +taxForm.homeLoanInt||0)
    setTaxResult(result)
  }

  const handleLogout = () => { logout(); navigate('/login') }

  if (showLoading) return <LoadingScreen />

  const tierBadge = healthScore
    ? healthScore.tier === 'good' ? 'success' : healthScore.tier === 'average' ? 'warning' : 'danger'
    : null

  return (
    <div className="flex h-screen overflow-hidden bg-slate-950">
      {showConfetti && <ConfettiEffect />}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 flex flex-col border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-md
        transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80">
          <Logo size={26} showWordmark={true} />
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto scrollbar-thin">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setSidebarOpen(false) }}
                className={`
                  w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isActive
                    ? 'bg-sky-500/10 text-sky-400'
                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                  }
                `}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                {tab.label}
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-sky-500/50" />}
              </button>
            )
          })}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/20 flex items-center justify-center text-sm font-bold text-sky-400 flex-shrink-0">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</div>
              <div className="text-xs text-slate-500 truncate">{user?.email || ''}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/60 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top bar */}
        <header className="flex-shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/40 backdrop-blur-xl z-20">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors border border-slate-800"
              onClick={() => setSidebarOpen(true)}
            >
              <LayoutDashboard className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white mb-0.5">
                Hello, {user?.name?.split(' ')[0] || 'Friend'} 👋
              </h1>
              <p className="text-xs font-medium text-slate-500">
                {formSubmitted && financeData
                  ? `Last analyzed: ${new Date(financeData.analyzedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
                  : "Let's align your financial goals today."
                }
              </p>
            </div>
          </div>
          {healthScore && (
            <Badge variant={tierBadge} className="hidden sm:inline-flex shadow-sm">
              {healthScore.tier === 'good' ? '✨' : healthScore.tier === 'average' ? '⚠️' : '🚨'} {healthScore.label} Health
            </Badge>
          )}
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-4 sm:p-8 space-y-6 lg:space-y-8 z-10">

          {/* Finance Input Form */}
          {!formSubmitted && (
            <Card className="animate-fade-up max-w-4xl mx-auto surface shadow-2xl shadow-sky-900/10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-[80px]" />
              <CardHeader className="pb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-2xl shadow-inner">📊</div>
                  <div>
                    <CardTitle className="text-xl">Financial Snapshot</CardTitle>
                    <CardDescription className="text-slate-400">Provide your current numbers to generate an AI 6-dimension health profile.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="f-income" className="text-slate-300">Monthly Income (₹)</Label>
                    <Input id="f-income" type="number" placeholder="85000" className={formErrors.income ? 'border-red-500/50' : ''} value={financeForm.income} onChange={e => handleFormChange('income', e.target.value)} />
                    {formErrors.income && <p className="text-[11px] font-medium text-red-500">{formErrors.income}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="f-expenses" className="text-slate-300">Monthly Expenses (₹)</Label>
                    <Input id="f-expenses" type="number" placeholder="40000" className={formErrors.expenses ? 'border-red-500/50' : ''} value={financeForm.expenses} onChange={e => handleFormChange('expenses', e.target.value)} />
                    {formErrors.expenses && <p className="text-[11px] font-medium text-red-500">{formErrors.expenses}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="f-emis" className="text-slate-300">Monthly EMIs (₹)</Label>
                    <Input id="f-emis" type="number" placeholder="12000" className={formErrors.emis ? 'border-red-500/50' : ''} value={financeForm.emis} onChange={e => handleFormChange('emis', e.target.value)} />
                    {formErrors.emis && <p className="text-[11px] font-medium text-red-500">{formErrors.emis}</p>}
                  </div>
                  <div className="space-y-2 lg:col-span-3 border-t border-slate-800/50 pt-5 mt-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Portfolio & Coverage</h4>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="f-savings" className="text-slate-300">Current Savings/FDs (₹)<InfoTooltip text="Total liquid cash, savings accounts, and fixed deposits you can access easily." /></Label>
                    <Input id="f-savings" type="number" placeholder="150000" className={formErrors.savings ? 'border-red-500/50' : ''} value={financeForm.savings} onChange={e => handleFormChange('savings', e.target.value)} />
                    {formErrors.savings && <p className="text-[11px] font-medium text-red-500">{formErrors.savings}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Have Health Insurance?</Label>
                    <Select value={financeForm.healthInsurance} onValueChange={v => handleFormChange('healthInsurance', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Have Life / Term Insurance?</Label>
                    <Select value={financeForm.lifeInsurance} onValueChange={v => handleFormChange('lifeInsurance', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Yes">Yes</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Investing for Retirement?</Label>
                    <Select value={financeForm.investingForRetirement} onValueChange={v => handleFormChange('investingForRetirement', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Yes">Yes (NPS, EPF, etc)</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Maxing Tax Deductions?<InfoTooltip text="Are you fully utilizing the ₹1.5L limit under Section 80C from ELSS, PPF, EPF, etc.?" /></Label>
                    <Select value={financeForm.utilizingTax80c} onValueChange={v => handleFormChange('utilizingTax80c', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Yes">Yes (80C, etc)</SelectItem><SelectItem value="No">No</SelectItem></SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 lg:col-span-3 border-t border-slate-800/50 pt-5 mt-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Goal Context</h4>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Risk Appetite</Label>
                    <Select value={financeForm.risk} onValueChange={v => handleFormChange('risk', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Low">Low — Conservative</SelectItem>
                        <SelectItem value="Medium">Medium — Balanced</SelectItem>
                        <SelectItem value="High">High — Aggressive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label className="text-slate-300">Primary Financial Goal</Label>
                    <Select value={financeForm.goal} onValueChange={v => handleFormChange('goal', v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="pt-2">
                  <Button size="xl" className="w-full sm:w-auto text-[15px] shadow-sky-500/25 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold" onClick={handleAnalyze}>
                    <Bot className="w-5 h-5 mr-1.5" /> Generate Deep Analysis
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick actions row */}
          {formSubmitted && (
            <div className="flex justify-between items-center animate-fade-in">
              <h2 className="text-2xl font-black tracking-tight text-white mb-1">{activeTab}</h2>
              <Button variant="outline" size="sm" onClick={() => setFormSubmitted(false)} className="bg-slate-900 border-slate-700">
                <RefreshCw className="w-3.5 h-3.5" /> Re-analyze Profile
              </Button>
            </div>
          )}

          {/* ===== OVERVIEW TAB ===== */}
          {activeTab === 'Overview' && formSubmitted && healthScore && plan && (
            <div className="space-y-6 lg:space-y-8 animate-fade-up">
              
              {/* Health score + radar */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                {/* Score */}
                <Card className="surface border border-slate-800 backdrop-blur-md">
                  <CardHeader className="pb-4 border-b border-slate-800/50">
                    <CardTitle className="flex items-center gap-2.5 font-bold"><Shield className="w-5 h-5 text-indigo-400" /> Money Health Index<InfoTooltip text="A comprehensive score (0-100) combining emergency buffer, insurance, savings, debt, taxes, and retirement readiness." /></CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center gap-6 pt-8">
                    <ScoreRing score={healthScore.score} label={healthScore.label} color={healthScore.color} />
                    <div className={`px-5 py-4 rounded-xl text-sm font-medium w-full text-center leading-relaxed ${
                      healthScore.tier === 'good' ? 'bg-sky-500/10 border border-sky-500/20 text-sky-200' :
                      healthScore.tier === 'average' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' :
                      'bg-red-500/10 border border-red-500/20 text-red-200'
                    }`}>
                      {healthScore.tier === 'good' && `✨ Outstanding! Your 6-dimension profile is robust. Focus on optimizing taxes next.`}
                      {healthScore.tier === 'average' && `📈 Solid baseline. Let's fix gaps in your 6-dimension profile to increase your resilience.`}
                      {healthScore.tier === 'poor' && `⚠️ Critical Alert: Significant vulnerabilities detected in your foundational setup.`}
                    </div>
                  </CardContent>
                </Card>

                {/* Radar */}
                <Card className="surface">
                   <CardHeader className="pb-4 border-b border-slate-800/50">
                    <CardTitle className="flex items-center gap-2.5 font-bold"><Target className="w-5 h-5 text-sky-400" /> 6-Dimension Profile<InfoTooltip text="Visual breakdown of your financial sturdiness across key life pillars." /></CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 h-[300px] w-full flex justify-center items-center">
                    <RadarChart cx="50%" cy="50%" outerRadius={90} width={400} height={300} data={healthScore.dimensions}>
                      <PolarGrid stroke="#334155" />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 600 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                      <Radar name="Score" dataKey="A" stroke="#0ea5e9" strokeWidth={3} fill="#0ea5e9" fillOpacity={0.25} />
                    </RadarChart>
                  </CardContent>
                </Card>
              </div>

               {/* Stat cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { icon: DollarSign, label: 'Income', value: formatCurrency(+financeForm.income), color: 'text-white', iconBg: 'bg-slate-800', iconColor: 'text-slate-300' },
                  { icon: TrendingDown, label: 'Commitments', value: formatCurrency(+financeForm.expenses + +financeForm.emis), color: 'text-slate-300', iconBg: 'bg-red-500/10', iconColor: 'text-red-400' },
                  { icon: PiggyBank, label: 'Capital', value: formatCurrency(+financeForm.savings), color: 'text-sky-400', iconBg: 'bg-sky-500/10', iconColor: 'text-sky-400' },
                  { icon: Wallet, label: 'Available Cash', value: formatCurrency(plan.monthlyAvailable - +financeForm.emis), color: 'text-indigo-400', iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-400' },
                ].map(s => (
                  <Card key={s.label} className="p-4 sm:p-5 surface">
                    <CardContent className="p-0">
                      <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center mb-4`}>
                        <s.icon className={`w-5 h-5 ${s.iconColor}`} />
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">{s.label}{s.label === 'Commitments' && <InfoTooltip text="Total of your monthly expenses and EMIs combined." />}{s.label === 'Available Cash' && <InfoTooltip text="Cash left after expenses and EMIs." />}</div>
                      <div className={`text-xl sm:text-2xl font-black tracking-tight ${s.color}`}>{s.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>

               {/* Emergency Fund Check */}
              <Card className="border-indigo-500/20 bg-gradient-to-r from-slate-900 to-indigo-950/20">
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-white mb-0.5">Safety Net Analysis<InfoTooltip text="Ideal buffer is 6 months of your absolute necessary living expenses." /></h3>
                        <p className="text-sm font-medium text-slate-400">Target: 6x Expenses ({formatCurrency(plan.emergencyFund.target)})</p>
                      </div>
                    </div>
                    {plan.emergencyFund.needed === 0 ? (
                      <Badge variant="success" className="self-start sm:self-center text-sm py-1 px-3">✅ Shield Active</Badge>
                    ) : (
                      <div className="flex-1 max-w-md w-full space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                          <span className="text-indigo-400">{formatCurrency(+financeForm.savings)} Protected</span>
                          <span className="text-slate-500">{formatCurrency(plan.emergencyFund.target)}</span>
                        </div>
                        <Progress value={Math.min(100, (+financeForm.savings / plan.emergencyFund.target) * 100)} className="h-2" indicatorClassName="bg-indigo-500" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== TAX WIZARD TAB ===== */}
          {activeTab === 'Tax Wizard' && formSubmitted && (
            <div className="space-y-6 lg:space-y-8 animate-fade-up">
              <Card className="surface border-sky-500/20 overflow-visible relative">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-2xl shadow-inner-sky">🧾</div>
                    <div>
                      <CardTitle className="text-xl">Tax Optimizer Engine</CardTitle>
                      <CardDescription className="text-slate-400">Model Old vs New tax regime to find your maximum take-home salary.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5">
                    <div className="space-y-2">
                      <Label className="text-slate-300">Basic Salary (Yearly)<InfoTooltip text="Your fixed base pay before allowances." /></Label>
                      <Input type="number" placeholder="1000000" value={taxForm.baseSalary} onChange={e => handleTaxFormChange('baseSalary', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">HRA Received (Yearly)<InfoTooltip text="House Rent Allowance provided by your employer." /></Label>
                      <Input type="number" placeholder="200000" value={taxForm.hraReceived} onChange={e => handleTaxFormChange('hraReceived', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Rent Paid (Monthly)<InfoTooltip text="Actual rent you pay for your accommodation, used to calculate HRA exemption." /></Label>
                      <Input type="number" placeholder="25000" value={taxForm.monthlyRent} onChange={e => handleTaxFormChange('monthlyRent', e.target.value)} />
                    </div>
                    <div className="space-y-2 lg:col-span-3 border-t border-slate-800/50 pt-5 mt-2">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Planned Deductions (Old Regime)</h4>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">80C (PPF, ELSS, EPF)<InfoTooltip text="A deduction up to ₹1.5L for ELSS, PPF, EPF, Life Insurance premiums, etc." /></Label>
                      <Input type="number" placeholder="150000" value={taxForm.deduction80c} onChange={e => handleTaxFormChange('deduction80c', e.target.value)} />
                      <p className="text-[10px] text-slate-500 mt-1">Max ₹1.5L allowed</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">80D (Health Insurance)<InfoTooltip text="Deduction for medical insurance premiums (up to ₹25K for self, +₹50k for senior citizen parents)." /></Label>
                      <Input type="number" placeholder="25000" value={taxForm.deduction80d} onChange={e => handleTaxFormChange('deduction80d', e.target.value)} />
                      <p className="text-[10px] text-slate-500 mt-1">Usually ₹25k - ₹50k</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-300">Section 24b (Home Loan Int.)<InfoTooltip text="Deduction up to ₹2L on interest paid for a self-occupied property." /></Label>
                      <Input type="number" placeholder="200000" value={taxForm.homeLoanInt} onChange={e => handleTaxFormChange('homeLoanInt', e.target.value)} />
                      <p className="text-[10px] text-slate-500 mt-1">Max ₹2L allowed</p>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Button onClick={handleTaxCalc} size="lg" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold">
                      <Calculator className="w-5 h-5 mr-1.5" /> Simulate Regimes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {taxResult && (
                <div className="space-y-6 lg:space-y-8 animate-fade-up">
                  {/* Winner Banner */}
                  <div className={`p-6 rounded-2xl border flex items-center justify-between ${
                    taxResult.savingsAmt > 0 ? 'bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border-emerald-500/30' : 'bg-slate-800/50 border-slate-700'
                  }`}>
                    <div>
                      <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Recommended Structure</h3>
                      <div className="text-2xl sm:text-3xl font-black text-white">{taxResult.winner}</div>
                    </div>
                    {taxResult.savingsAmt > 0 && (
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-400/80 mb-1">Max Tax Savings</div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-400">{formatCurrency(taxResult.savingsAmt)}</div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Old Regime */}
                    <Card className={`surface relative overflow-hidden ${taxResult.winner === 'Old Tax Regime' && taxResult.savingsAmt > 0 ? 'border-emerald-500/30 ring-1 ring-emerald-500/20' : ''}`}>
                      {taxResult.winner === 'Old Tax Regime' && taxResult.savingsAmt > 0 && (
                        <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Winner</div>
                      )}
                      <CardHeader className="border-b border-slate-800/50">
                        <CardTitle className="text-lg">Old Tax Regime<InfoTooltip text="Allows all exemptions (HRA, 80C, 80D, etc.) but has higher slab rates." /></CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Standard Deduction<InfoTooltip text="A flat deduction of ₹50,000 available to all salaried individuals in both regimes." /></span>
                          <span className="text-white font-medium">₹50,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Total Eligible Deductions</span>
                          <span className="text-white font-medium">{formatCurrency((+taxForm.baseSalary + +taxForm.hraReceived) - taxResult.oldTaxable - 50000)}</span>
                        </div>
                        <div className="border-t border-slate-800/50 pt-4 flex justify-between items-center">
                          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Net Taxable<InfoTooltip text="The amount your tax is calculated on after all exemptions are removed from your gross salary." /></span>
                          <span className="text-slate-300 font-bold">{formatCurrency(taxResult.oldTaxable)}</span>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center mt-2 border border-slate-800">
                          <span className="font-semibold text-white">Total Tax Payable</span>
                          <span className="text-2xl font-black text-white">{formatCurrency(taxResult.oldTax)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* New Regime */}
                    <Card className={`surface relative overflow-hidden ${taxResult.winner === 'New Tax Regime' && taxResult.savingsAmt > 0 ? 'border-sky-500/30 ring-1 ring-sky-500/20' : ''}`}>
                      {taxResult.winner === 'New Tax Regime' && taxResult.savingsAmt > 0 && (
                        <div className="absolute top-0 right-0 bg-sky-500 text-slate-950 text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">Winner</div>
                      )}
                      <CardHeader className="border-b border-slate-800/50">
                        <CardTitle className="text-lg">New Tax Regime<InfoTooltip text="Offers lower slab rates but revokes most exemptions like HRA and 80C, keeping only Standard Deduction." /></CardTitle>
                      </CardHeader>
                      <CardContent className="pt-6 space-y-4">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Standard Deduction<InfoTooltip text="A flat deduction of ₹50,000 available to all salaried individuals in both regimes." /></span>
                          <span className="text-white font-medium">₹50,000</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-slate-400">Total Eligible Deductions</span>
                          <span className="text-white font-medium">₹0</span>
                        </div>
                        <div className="border-t border-slate-800/50 pt-4 flex justify-between items-center">
                          <span className="text-slate-500 font-bold uppercase tracking-widest text-xs">Net Taxable<InfoTooltip text="The amount your tax is calculated on after the standard deduction." /></span>
                          <span className="text-slate-300 font-bold">{formatCurrency(taxResult.newTaxable)}</span>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl flex justify-between items-center mt-2 border border-slate-800">
                          <span className="font-semibold text-white">Total Tax Payable</span>
                          <span className="text-2xl font-black text-white">{formatCurrency(taxResult.newTax)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ===== OTHER TABS OMITTED FOR BREVITY, RESTORED BELOW ===== */}
          {/* ===== FINANCIAL PLAN TAB ===== */}
          {activeTab === 'Financial Plan' && formSubmitted && plan && (
            <div className="space-y-6 lg:space-y-8 animate-fade-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="surface"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><TrendingUp className="w-5 h-5 text-sky-400" /> Optimal SIP Range<InfoTooltip text="Systematic Investment Plan. Investing a fixed amount regularly into mutual funds." /></CardTitle></CardHeader><CardContent className="pt-6"><div className="flex justify-around py-4 text-center"><div><div className="text-xs font-bold text-slate-500 uppercase">Min</div><div className="text-3xl font-black text-amber-500/90">{formatCurrency(plan.sipRange.min)}</div></div><div className="text-slate-700 text-3xl">→</div><div><div className="text-xs font-bold text-slate-500 uppercase">Ideal</div><div className="text-3xl font-black text-sky-400">{formatCurrency(plan.sipRange.max)}</div></div></div></CardContent></Card>
                <Card className="surface"><CardHeader><CardTitle className="flex items-center gap-2 text-lg"><ShieldCheck className="w-5 h-5 text-indigo-400" /> Budget Breakdown</CardTitle></CardHeader><CardContent className="pt-6"><div className="space-y-4"><div className="flex justify-between"><span>Needs (50%)</span><span className="font-bold text-indigo-400">{formatCurrency(plan.budgetBreakdown.needs)}</span></div><div className="flex justify-between"><span>Wants (30%)</span><span className="font-bold text-amber-400">{formatCurrency(plan.budgetBreakdown.wants)}</span></div><div className="flex justify-between"><span>Savings (20%)</span><span className="font-bold text-sky-400">{formatCurrency(plan.budgetBreakdown.savings)}</span></div></div></CardContent></Card>
              </div>
            </div>
          )}
          
          {/* ===== GOAL PLANNER TAB ===== */}
          {activeTab === 'Goal Planner' && (
            <div className="space-y-6 lg:space-y-8 animate-fade-up">
              <Card className="surface">
                <CardHeader className="pb-4 border-b border-slate-800/50">
                  <CardTitle className="text-xl">Financial Goal Tracker</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <Label className="text-slate-300 font-semibold">Goal</Label>
                       <Select value={goalForm.goalType} onValueChange={v => setGoalForm(f => ({ ...f, goalType: v }))}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{GOALS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select>
                    </div>
                    <div className="space-y-2"><Label className="text-slate-300 font-semibold">Total Required (₹)</Label><Input type="number" placeholder="5000000" value={goalForm.targetAmount} onChange={e => setGoalForm(f => ({ ...f, targetAmount: e.target.value }))} /></div>
                    <div className="space-y-2"><Label className="text-slate-300 font-semibold">Time Horizon (mo)</Label><Input type="number" placeholder="36" value={goalForm.months} onChange={e => setGoalForm(f => ({ ...f, months: e.target.value }))} /></div>
                  </div>
                  <Button onClick={handleGoalCalc} size="lg" className="w-full sm:w-auto bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold">🎯 Masterplan My Goal</Button>
                  {goalResult && (
                    <div className="pt-6 border-t border-slate-800 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-slate-800/40 text-center"><div className="text-[11px] font-bold text-slate-500">SAVINGS NEEDED</div><div className="text-lg font-black text-white mt-1">{formatCurrency(goalResult.monthlySavingsNeeded)}/mo</div></div>
                        <div className="p-4 rounded-xl bg-slate-800/40 text-center"><div className="text-[11px] font-bold text-slate-500">DEFICIT</div><div className="text-lg font-black text-amber-400 mt-1">{formatCurrency(goalResult.remaining)}</div></div>
                        <div className="p-4 rounded-xl bg-slate-800/40 text-center"><div className="text-[11px] font-bold text-slate-500">TIMELINE</div><div className="text-lg font-black text-sky-400 mt-1">{goalForm.months} mo</div></div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* ===== INVESTMENTS TAB ===== */}
          {activeTab === 'Investments' && formSubmitted && plan && (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up">
              {plan.investments.map((inv, i) => (
                <Card key={inv.name} className="p-6 surface" style={{ animationDelay: `${i * 0.1}s` }}>
                  <CardContent className="p-0">
                    <div className="flex items-center justify-between mb-5"><span className="text-4xl bg-slate-800/50 p-2.5 rounded-2xl border border-slate-700/50">{inv.icon}</span><span className="text-3xl font-black tracking-tighter text-white">{inv.allocation}</span></div>
                    <div className="font-bold text-white text-base mb-1.5">{inv.name}</div>
                    <Badge variant="success" className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Target: {inv.return}</Badge>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Est. SIP ~ {formatCurrency(Math.round(plan.sipRange.max * parseInt(inv.allocation) / 100))}</div>
                    <Progress value={parseInt(inv.allocation)} className="h-1.5" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* ===== PORTFOLIO X-RAY TAB ===== */}
          {activeTab === 'Portfolio X-Ray' && (
            <div className="space-y-6 lg:space-y-8 animate-fade-up">
              {xrayState === 'idle' && (
                <Card className="surface border-sky-500/20">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2.5">
                      <Microscope className="w-5 h-5 text-sky-400" /> AI Portfolio X-Ray<InfoTooltip text="Upload your CAS (Consolidated Account Statement) to uncover hidden overlap, excessive fees, and underperformance." />
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Upload your NSDL/CDSL CAS (Consolidated Account Statement) to audit your mutual fund resilience.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div
                      className={`cursor-pointer border-2 border-dashed rounded-2xl p-8 lg:p-16 text-center transition-colors ${dragActive ? 'border-sky-500 bg-sky-500/10' : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800/50 hover:border-slate-600'}`}
                      onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                      onDragLeave={() => setDragActive(false)}
                      onDrop={(e) => { e.preventDefault(); setDragActive(false); handleXrayScan(); }}
                      onClick={handleXrayScan}
                     >
                       <UploadCloud className="w-12 h-12 text-sky-400 mx-auto mb-4" />
                       <h3 className="text-white font-bold text-lg mb-1">Click or Drag & Drop CAS PDF</h3>
                       <p className="text-slate-400 text-sm max-w-sm mx-auto">Supports NSDL/CDSL and CAMS Statements up to 10MB. We do not store your data.</p>
                       <Button className="mt-6 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 pointer-events-none">Select File</Button>
                     </div>
                  </CardContent>
                </Card>
              )}

              {xrayState === 'scanning' && (
                <Card className="surface border-sky-500/20 py-16">
                  <CardContent className="flex flex-col items-center justify-center space-y-6 text-center">
                      <div className="relative w-24 h-24">
                        <div className="absolute inset-0 rounded-full border border-sky-500/30"></div>
                        <div className="absolute inset-0 rounded-full border-t-2 border-sky-400 animate-spin"></div>
                        <FileSearch className="w-8 h-8 text-sky-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-2 animate-pulse">AI analyzing fund overlap & expense ratios...</h3>
                        <p className="text-slate-400">Deconstructing your mutual fund portfolio across 12 sectors.</p>
                      </div>
                  </CardContent>
                </Card>
              )}

              {xrayState === 'result' && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center sm:flex-row flex-col gap-4">
                    <h2 className="text-2xl font-black text-white">X-Ray Analysis Report</h2>
                    <Button variant="outline" size="sm" onClick={() => setXrayState('idle')} className="bg-slate-900 border-slate-700">Scan New Statement</Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="surface lg:col-span-2 border-rose-500/20 ring-1 ring-rose-500/10">
                      <CardHeader className="border-b border-slate-800/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-400" /> High Fund Overlap Detected<InfoTooltip text="Overlap means your different mutual funds are holding the exact same stocks, reducing diversification benefits." /></CardTitle>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4">
                         <p className="text-sm text-slate-300 leading-relaxed">
                           You are holding <span className="text-white font-bold">HDFC Growth Fund</span> and <span className="text-white font-bold">SBI Bluechip Fund</span>. 
                           <span className="text-rose-400 font-bold ml-1">82% of the stocks inside these funds are identical.</span>
                         </p>
                         <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4">
                           <h4 className="text-sm font-semibold text-rose-200 mb-2">Recommendation</h4>
                           <p className="text-xs text-rose-300">Merge these funds to reduce complexity. Holding multiple large-cap funds doesn't significantly increase diversification, it only duplicates management fees.</p>
                         </div>
                      </CardContent>
                    </Card>

                    <Card className="surface border-amber-500/20">
                      <CardHeader className="border-b border-slate-800/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><DollarSign className="w-5 h-5 text-amber-400" /> Expense Ratio Leak<InfoTooltip text="Expense ratio is the annual fee that mutual funds charge to manage your money." /></CardTitle>
                      </CardHeader>
                      <CardContent className="pt-5 space-y-4 text-center pb-6">
                         <div className="text-4xl font-black text-amber-500 uppercase">₹12,450</div>
                         <div className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-1">Lost to Fees Yearly</div>
                         <p className="text-sm text-slate-300 mt-4 leading-relaxed text-left pb-2">
                           You are invested in <strong>Regular</strong> plans instead of <strong>Direct</strong> plans. Brokers are taking a 1.2% commission every year.
                         </p>
                         <Button size="sm" className="w-full bg-amber-500 hover:bg-amber-400 text-amber-950 font-bold mt-2">Switch to Direct Plans</Button>
                      </CardContent>
                    </Card>

                    <Card className="surface">
                      <CardHeader className="border-b border-slate-800/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-400" /> Asset Allocation</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-5">
                         <div className="space-y-5">
                           <div>
                             <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-300 font-medium">Equity (High Risk)</span><span className="text-emerald-400 font-bold">85%</span></div>
                             <Progress value={85} className="h-1.5" indicatorClassName="bg-emerald-500" />
                           </div>
                           <div>
                             <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-300 font-medium">Debt / Bonds (Low Risk)</span><span className="text-sky-400 font-bold">10%</span></div>
                             <Progress value={10} className="h-1.5" indicatorClassName="bg-sky-500" />
                           </div>
                           <div>
                             <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-300 font-medium">Commodities (Gold)</span><span className="text-amber-400 font-bold">5%</span></div>
                             <Progress value={5} className="h-1.5" indicatorClassName="bg-amber-500" />
                           </div>
                         </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="surface lg:col-span-2">
                      <CardHeader className="border-b border-slate-800/50 pb-4">
                        <CardTitle className="text-lg flex items-center gap-2"><TrendingDown className="w-5 h-5 text-slate-400" /> Underperforming Fund Alert</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-5">
                         <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                           <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-lg bg-rose-500/10 flex items-center justify-center">
                               <PieChart className="w-5 h-5 text-rose-400" />
                             </div>
                             <div>
                               <div className="text-sm font-bold text-white mb-0.5">Axis Small Cap Fund</div>
                               <div className="text-xs text-slate-400">Underperformed its benchmark by <span className="text-rose-400 font-medium">2.4%</span> over 3Y</div>
                             </div>
                           </div>
                           <Badge variant="danger" className="bg-rose-500/10 text-rose-400 border border-rose-500/20 py-1.5 hidden sm:inline-flex">Action Recommended</Badge>
                         </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Empty state */}
          {!formSubmitted && activeTab !== 'Overview' && activeTab !== 'Tax Wizard' && activeTab !== 'Portfolio X-Ray' && (
            <Card className="text-center py-20 surface border-dashed border-slate-700 bg-transparent">
              <CardContent className="space-y-4">
                <div className="text-6xl mb-4 opacity-50">🧭</div>
                <h3 className="text-2xl font-bold tracking-tight text-white">Unlock Your Blueprint</h3>
                <p className="text-slate-400 text-sm max-w-sm mx-auto font-medium leading-relaxed">
                  Provide your initial numbers in the form above to unlock full {activeTab} framework.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Spacer for chat fab */}
          <div className="h-24" />
        </div>
      </main>

      {/* Floating Chat */}
      <ChatAssistant />
    </div>
  )
}
