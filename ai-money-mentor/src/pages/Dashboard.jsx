import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, logout } from '../utils/auth'
import { getFinanceData, saveFinanceData, calculateHealthScore, generateFinancialPlan, calculateGoalPlan, formatCurrency } from '../utils/finance'
import CircularProgress from '../components/CircularProgress'
import ChatAssistant from '../components/ChatAssistant'
import './Dashboard.css'

const TABS = ['Overview', 'Financial Plan', 'Goal Planner', 'Investments']

const GOALS = ['Emergency Fund', 'House / Property', 'Retirement', 'Education', 'Travel / Vacation', 'Business / Startup', 'Vehicle', 'Other']

function LoadingScreen() {
  const [step, setStep] = useState(0)
  const STEPS = [
    'Analyzing your financial profile...',
    'Calculating your health score...',
    'Generating AI recommendations...',
    'Crafting your financial plan...',
  ]
  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % STEPS.length), 900)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-icon">🤖</div>
        <div className="loading-spinner-ring" />
        <p className="loading-text">{STEPS[step]}</p>
        <div className="loading-dots"><span/><span/><span/></div>
      </div>
    </div>
  )
}

function ConfettiEffect() {
  useEffect(() => {
    import('canvas-confetti').then(m => {
      const confetti = m.default
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: ['#00d4aa', '#7c5cfc', '#f5c842', '#ff4d6d'] })
      setTimeout(() => confetti({ particleCount: 60, spread: 60, origin: { y: 0.4 } }), 400)
    })
  }, [])
  return null
}

export default function Dashboard() {
  const navigate = useNavigate()
  const user = getSession()
  const [activeTab, setActiveTab] = useState('Overview')
  const [showLoading, setShowLoading] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Finance form state
  const [financeForm, setFinanceForm] = useState({
    income: '',
    expenses: '',
    savings: '',
    goal: 'Emergency Fund',
    risk: 'Medium',
  })
  const [formErrors, setFormErrors] = useState({})

  // Computed data
  const [financeData, setFinanceData] = useState(null)
  const [healthScore, setHealthScore] = useState(null)
  const [plan, setPlan] = useState(null)

  // Goal planner form
  const [goalForm, setGoalForm] = useState({ goalType: 'House / Property', targetAmount: '', months: '36' })
  const [goalResult, setGoalResult] = useState(null)

  // Load saved data
  useEffect(() => {
    if (!user) return
    const saved = getFinanceData(user.id)
    if (saved) {
      setFinanceForm(saved.form)
      setFinanceData(saved)
      setFormSubmitted(true)
      const hs = calculateHealthScore(+saved.form.income, +saved.form.expenses, +saved.form.savings)
      setHealthScore(hs)
      const p = generateFinancialPlan(+saved.form.income, +saved.form.expenses, +saved.form.savings, saved.form.risk, saved.form.goal)
      setPlan(p)
    }
  }, [])

  const handleFormChange = e => {
    const { name, value } = e.target
    setFinanceForm(f => ({ ...f, [name]: value }))
    setFormErrors(er => ({ ...er, [name]: '' }))
  }

  const validateForm = () => {
    const e = {}
    if (!financeForm.income || +financeForm.income <= 0) e.income = 'Enter a valid income'
    if (!financeForm.expenses || +financeForm.expenses < 0) e.expenses = 'Enter valid expenses'
    if (+financeForm.expenses >= +financeForm.income) e.expenses = 'Expenses must be less than income'
    if (!financeForm.savings && financeForm.savings !== '0') e.savings = 'Enter current savings (0 if none)'
    return e
  }

  const handleAnalyze = async () => {
    const errs = validateForm()
    if (Object.keys(errs).length) { setFormErrors(errs); return }

    setShowLoading(true)
    await new Promise(r => setTimeout(r, 3000))
    setShowLoading(false)

    const income = +financeForm.income
    const expenses = +financeForm.expenses
    const savings = +financeForm.savings || 0

    const hs = calculateHealthScore(income, expenses, savings)
    const p = generateFinancialPlan(income, expenses, savings, financeForm.risk, financeForm.goal)

    const data = { form: financeForm, analyzedAt: new Date().toISOString() }
    saveFinanceData(user.id, data)
    setFinanceData(data)
    setHealthScore(hs)
    setPlan(p)
    setFormSubmitted(true)

    if (hs.tier === 'good') {
      setTimeout(() => { setShowConfetti(true) }, 100)
    }

    setActiveTab('Overview')
  }

  const handleGoalCalc = () => {
    if (!goalForm.targetAmount || +goalForm.targetAmount <= 0 || !goalForm.months || +goalForm.months <= 0) return
    const savings = +financeForm.savings || 0
    const result = calculateGoalPlan(goalForm.goalType, +goalForm.targetAmount, +goalForm.months, savings)
    setGoalResult(result)
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (showLoading) return <LoadingScreen />

  return (
    <div className="dashboard-page page-enter">
      {showConfetti && <ConfettiEffect />}

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span>💰</span>
          <span>Money<span className="gradient-text">Mentor</span></span>
        </div>

        <nav className="sidebar-nav">
          {TABS.map(tab => (
            <button
              key={tab}
              className={`sidebar-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'Overview' && '📊'}
              {tab === 'Financial Plan' && '📋'}
              {tab === 'Goal Planner' && '🎯'}
              {tab === 'Investments' && '📈'}
              {tab}
            </button>
          ))}
        </nav>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.name?.[0]?.toUpperCase() || 'U'}</div>
          <div className="user-info">
            <div className="user-name">{user?.name || 'User'}</div>
            <div className="user-email">{user?.email || ''}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">↩</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="dashboard-main">
        {/* Top bar */}
        <header className="dash-header">
          <div>
            <h1 className="dash-greeting">
              Hello, <span className="gradient-text">{user?.name?.split(' ')[0] || 'Friend'}</span> 👋
            </h1>
            <p className="dash-subtitle">
              {formSubmitted
                ? `Last analyzed: ${new Date(financeData?.analyzedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}`
                : "Let's analyze your financial health today."}
            </p>
          </div>
          {healthScore && (
            <div className={`health-badge badge badge-${healthScore.tier === 'good' ? 'success' : healthScore.tier === 'average' ? 'warning' : 'danger'}`}>
              {healthScore.tier === 'good' ? '✅' : healthScore.tier === 'average' ? '⚠️' : '🚨'} {healthScore.label}
            </div>
          )}
        </header>

        {/* Finance Input Form */}
        {!formSubmitted && (
          <section className="finance-form-section glass-card animate-fade-up">
            <div className="form-section-header">
              <div className="form-icon">🧮</div>
              <div>
                <h2>Analyze My Finances</h2>
                <p>Fill in your financial details to get your personalized money health score and plan.</p>
              </div>
            </div>
            <div className="finance-form-grid">
              <div className="form-group">
                <label className="form-label" htmlFor="f-income">Monthly Income (₹)</label>
                <input id="f-income" name="income" type="number" className={`form-input ${formErrors.income ? 'input-error' : ''}`} placeholder="e.g. 85000" value={financeForm.income} onChange={handleFormChange} min="0" />
                {formErrors.income && <span className="form-error">⚠ {formErrors.income}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-expenses">Monthly Expenses (₹)</label>
                <input id="f-expenses" name="expenses" type="number" className={`form-input ${formErrors.expenses ? 'input-error' : ''}`} placeholder="e.g. 55000" value={financeForm.expenses} onChange={handleFormChange} min="0" />
                {formErrors.expenses && <span className="form-error">⚠ {formErrors.expenses}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-savings">Current Savings (₹)</label>
                <input id="f-savings" name="savings" type="number" className={`form-input ${formErrors.savings ? 'input-error' : ''}`} placeholder="e.g. 120000" value={financeForm.savings} onChange={handleFormChange} min="0" />
                {formErrors.savings && <span className="form-error">⚠ {formErrors.savings}</span>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="f-risk">Risk Appetite</label>
                <select id="f-risk" name="risk" className="form-input" value={financeForm.risk} onChange={handleFormChange}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                <label className="form-label" htmlFor="f-goal">Primary Financial Goal</label>
                <select id="f-goal" name="goal" className="form-input" value={financeForm.goal} onChange={handleFormChange}>
                  {GOALS.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '8px' }} onClick={handleAnalyze}>
              🤖 Analyze My Finances
            </button>
          </section>
        )}

        {formSubmitted && (
          <div className="dash-quick-actions">
            <button className="btn btn-ghost btn-sm" onClick={() => setFormSubmitted(false)}>✏️ Update Details</button>
          </div>
        )}

        {/* ===== OVERVIEW TAB ===== */}
        {activeTab === 'Overview' && formSubmitted && healthScore && plan && (
          <div className="tab-content animate-fade-up">

            {/* Stat cards row */}
            <div className="stat-cards-row">
              <div className="stat-card glass-card">
                <div className="sc-icon income">💵</div>
                <div className="sc-label">Monthly Income</div>
                <div className="sc-value">{formatCurrency(+financeForm.income)}</div>
              </div>
              <div className="stat-card glass-card">
                <div className="sc-icon expense">💸</div>
                <div className="sc-label">Monthly Expenses</div>
                <div className="sc-value" style={{color:'var(--accent-danger)'}}>{formatCurrency(+financeForm.expenses)}</div>
              </div>
              <div className="stat-card glass-card">
                <div className="sc-icon saved">🏦</div>
                <div className="sc-label">Current Savings</div>
                <div className="sc-value" style={{color:'var(--accent-primary)'}}>{formatCurrency(+financeForm.savings)}</div>
              </div>
              <div className="stat-card glass-card">
                <div className="sc-icon available">📥</div>
                <div className="sc-label">Monthly Available</div>
                <div className="sc-value" style={{color:'var(--accent-secondary)'}}>{formatCurrency(plan.monthlyAvailable)}</div>
              </div>
            </div>

            {/* Health score + budget */}
            <div className="overview-grid">
              {/* Health Score Card */}
              <div className="glass-card health-score-card">
                <h2>💓 Money Health Score</h2>
                <CircularProgress
                  score={healthScore.score}
                  label={healthScore.label}
                  color={healthScore.color}
                />
                <div className="health-message">
                  {healthScore.tier === 'good' && (
                    <><p className="health-positive">🎉 Outstanding! You're saving {Math.round(healthScore.ratio * 100)}% of your income — well above the recommended 20%.</p><p style={{color:'var(--text-secondary)',fontSize:'0.85rem',marginTop:'8px'}}>Keep it up! Consider increasing SIP contributions.</p></>
                  )}
                  {healthScore.tier === 'average' && (
                    <><p className="health-avg">📈 You're on the right track! Saving {Math.round(healthScore.ratio * 100)}% of your income.</p><p style={{color:'var(--text-secondary)',fontSize:'0.85rem',marginTop:'8px'}}>Try reducing discretionary expenses by 10% to enter the "Excellent" tier.</p></>
                  )}
                  {healthScore.tier === 'poor' && (
                    <><p className="health-poor">⚠️ Alert: You're saving only {Math.round(healthScore.ratio * 100)}% of your income — below the recommended 20%.</p><p style={{color:'var(--text-secondary)',fontSize:'0.85rem',marginTop:'8px'}}>Focus on reducing expenses or finding additional income sources.</p></>
                  )}
                </div>
              </div>

              {/* Budget Breakdown */}
              <div className="glass-card budget-card">
                <h2>📊 50/30/20 Budget Plan</h2>
                <div className="budget-items">
                  {[
                    { label: 'Needs (50%)', amount: plan.budgetBreakdown.needs, color: 'var(--accent-secondary)', icon: '🏠', desc: 'Rent, food, utilities, transport' },
                    { label: 'Wants (30%)', amount: plan.budgetBreakdown.wants, color: 'var(--accent-warning)', icon: '🎭', desc: 'Dining, entertainment, shopping' },
                    { label: 'Savings (20%)', amount: plan.budgetBreakdown.savings, color: 'var(--accent-primary)', icon: '💰', desc: 'Investments, savings, EMIs' },
                  ].map(item => (
                    <div key={item.label} className="budget-item">
                      <div className="bi-top">
                        <span className="bi-icon">{item.icon}</span>
                        <div className="bi-info">
                          <div className="bi-label">{item.label}</div>
                          <div className="bi-desc">{item.desc}</div>
                        </div>
                        <div className="bi-amount" style={{color: item.color}}>{formatCurrency(item.amount)}</div>
                      </div>
                      <div className="bi-bar-track">
                        <div className="bi-bar-fill" style={{
                          width: `${(item.amount / +financeForm.income) * 100}%`,
                          background: item.color
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="actual-vs-plan">
                  <div className="avp-item">
                    <span className="avp-label">Actual Expenses</span>
                    <span className="avp-value" style={{color: 'var(--accent-danger)'}}>{formatCurrency(+financeForm.expenses)}</span>
                  </div>
                  <div className="avp-item">
                    <span className="avp-label">Suggested Limit</span>
                    <span className="avp-value" style={{color: 'var(--accent-primary)'}}>{formatCurrency(plan.budgetBreakdown.needs + plan.budgetBreakdown.wants)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Fund */}
            <div className="glass-card emergency-card">
              <div className="ec-left">
                <div className="ec-icon">🛡️</div>
                <div>
                  <h3>Emergency Fund Status</h3>
                  <p>Target: 6 months of expenses ({formatCurrency(plan.emergencyFund.target)})</p>
                </div>
              </div>
              <div className="ec-right">
                {plan.emergencyFund.needed === 0 ? (
                  <div className="badge badge-success">✅ Fully Funded!</div>
                ) : (
                  <div className="ec-progress-info">
                    <div className="ec-amounts">
                      <span>{formatCurrency(+financeForm.savings)} saved</span>
                      <span style={{color:'var(--text-muted)'}}>/ {formatCurrency(plan.emergencyFund.target)}</span>
                    </div>
                    <div className="ec-bar">
                      <div className="ec-fill" style={{width: `${Math.min(100, (+financeForm.savings / plan.emergencyFund.target) * 100)}%`}} />
                    </div>
                    <span className="ec-months">~{plan.emergencyFund.months} months to complete</span>
                  </div>
                )}
              </div>
            </div>

            {/* AI Insights */}
            <div className="glass-card insights-card">
              <h2>🤖 AI Insights for You</h2>
              <div className="insights-grid">
                <div className="insight-item">
                  <span className="insight-emoji">💡</span>
                  <div>
                    <div className="insight-title">SIP Sweet Spot</div>
                    <div className="insight-text">Invest {formatCurrency(plan.sipRange.min)}–{formatCurrency(plan.sipRange.max)}/month via SIP for maximum wealth creation.</div>
                  </div>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">🎯</span>
                  <div>
                    <div className="insight-title">Your Goal: {financeForm.goal}</div>
                    <div className="insight-text">With {formatCurrency(plan.monthlyAvailable)}/month available, you're positioned to achieve this goal. Check the Goal Planner tab!</div>
                  </div>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">⚡</span>
                  <div>
                    <div className="insight-title">Risk Profile: {financeForm.risk}</div>
                    <div className="insight-text">
                      {financeForm.risk === 'Low' ? 'Great for capital preservation. Focus on FD, PPF, and debt funds.' :
                       financeForm.risk === 'Medium' ? 'Balanced approach. Mix of equity index funds and bonds recommended.' :
                       'Growth-oriented. Consider mid/small-cap funds and direct equity for higher returns.'}
                    </div>
                  </div>
                </div>
                <div className="insight-item">
                  <span className="insight-emoji">📅</span>
                  <div>
                    <div className="insight-title">Start Small, Think Big</div>
                    <div className="insight-text">{formatCurrency(plan.sipRange.min)}/month at 12% for 20 years = <strong style={{color:'var(--accent-primary)'}}>₹{Math.round(plan.sipRange.min * (Math.pow(1.01, 240) - 1) / 0.01 / 100000)}L+</strong> corpus!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== FINANCIAL PLAN TAB ===== */}
        {activeTab === 'Financial Plan' && formSubmitted && plan && (
          <div className="tab-content animate-fade-up">
            <div className="plan-grid">
              {/* SIP Recommendation */}
              <div className="glass-card plan-card">
                <div className="plan-card-header">
                  <span>📈</span>
                  <h3>SIP Recommendation</h3>
                </div>
                <div className="sip-range">
                  <div className="sip-amount">
                    <div className="sip-label">Minimum SIP</div>
                    <div className="sip-value" style={{color:'var(--accent-warning)'}}>{formatCurrency(plan.sipRange.min)}<span>/mo</span></div>
                  </div>
                  <div className="sip-divider">→</div>
                  <div className="sip-amount">
                    <div className="sip-label">Ideal SIP</div>
                    <div className="sip-value" style={{color:'var(--accent-primary)'}}>{formatCurrency(plan.sipRange.max)}<span>/mo</span></div>
                  </div>
                </div>
                <p className="plan-note">📌 Invest 20–30% of income monthly. Start with the minimum and increase 10% annually.</p>
              </div>

              {/* Emergency Fund */}
              <div className="glass-card plan-card">
                <div className="plan-card-header">
                  <span>🛡️</span>
                  <h3>Emergency Fund Plan</h3>
                </div>
                <div className="ef-stats">
                  <div className="ef-stat">
                    <div className="ef-stat-label">Target</div>
                    <div className="ef-stat-value">{formatCurrency(plan.emergencyFund.target)}</div>
                  </div>
                  <div className="ef-stat">
                    <div className="ef-stat-label">Still Need</div>
                    <div className="ef-stat-value" style={{color: plan.emergencyFund.needed === 0 ? 'var(--accent-primary)' : 'var(--accent-warning)'}}>
                      {plan.emergencyFund.needed === 0 ? '✅ Done!' : formatCurrency(plan.emergencyFund.needed)}
                    </div>
                  </div>
                  <div className="ef-stat">
                    <div className="ef-stat-label">Time to Build</div>
                    <div className="ef-stat-value">{plan.emergencyFund.months === 0 ? 'Ready!' : `${plan.emergencyFund.months} months`}</div>
                  </div>
                </div>
                <p className="plan-note">📌 Keep in a liquid fund or FD — accessible within 1-3 business days.</p>
              </div>
            </div>

            {/* Full Budget Breakdown */}
            <div className="glass-card full-budget-card">
              <h3>💰 Recommended Monthly Budget Allocation</h3>
              <div className="full-budget-grid">
                {[
                  { category: 'Needs & Essentials', pct: 50, amount: plan.budgetBreakdown.needs, color: 'var(--accent-secondary)', items: ['Rent/EMI', 'Groceries & Food', 'Utilities', 'Transport', 'Insurance'] },
                  { category: 'Lifestyle & Wants', pct: 30, amount: plan.budgetBreakdown.wants, color: 'var(--accent-warning)', items: ['Dining Out', 'Entertainment', 'Shopping', 'Subscriptions', 'Travel'] },
                  { category: 'Savings & Investments', pct: 20, amount: plan.budgetBreakdown.savings, color: 'var(--accent-primary)', items: ['SIP / Mutual Funds', 'PPF / NPS', 'Emergency Fund', 'Stocks', 'Debt Repayment'] },
                ].map(cat => (
                  <div key={cat.category} className="full-budget-item" style={{'--cat-color': cat.color}}>
                    <div className="fbi-header">
                      <div className="fbi-pct" style={{color: cat.color}}>{cat.pct}%</div>
                      <div>
                        <div className="fbi-cat">{cat.category}</div>
                        <div className="fbi-amount" style={{color: cat.color}}>{formatCurrency(cat.amount)}/month</div>
                      </div>
                    </div>
                    <ul className="fbi-list">
                      {cat.items.map(it => <li key={it}>• {it}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===== GOAL PLANNER TAB ===== */}
        {activeTab === 'Goal Planner' && (
          <div className="tab-content animate-fade-up">
            <div className="glass-card goal-planner-card">
              <div className="plan-card-header">
                <span>🎯</span>
                <div>
                  <h2>Goal Planner</h2>
                  <p>Tell me your goal — I'll tell you exactly how to reach it.</p>
                </div>
              </div>

              <div className="goal-form-grid">
                <div className="form-group">
                  <label className="form-label">Goal Type</label>
                  <select className="form-input" value={goalForm.goalType} onChange={e => setGoalForm(f => ({...f, goalType: e.target.value}))}>
                    {GOALS.map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Target Amount (₹)</label>
                  <input type="number" className="form-input" placeholder="e.g. 5000000" value={goalForm.targetAmount} onChange={e => setGoalForm(f => ({...f, targetAmount: e.target.value}))} min="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Timeline (months)</label>
                  <input type="number" className="form-input" placeholder="e.g. 36" value={goalForm.months} onChange={e => setGoalForm(f => ({...f, months: e.target.value}))} min="1" />
                </div>
              </div>

              <button className="btn btn-primary" onClick={handleGoalCalc}>
                🎯 Calculate My Goal Plan
              </button>

              {goalResult && (
                <div className="goal-result animate-fade-up">
                  <div className="goal-result-cards">
                    <div className="gr-card">
                      <div className="gr-icon">💸</div>
                      <div className="gr-label">Monthly Savings Needed</div>
                      <div className="gr-value">{formatCurrency(goalResult.monthlySavingsNeeded)}</div>
                    </div>
                    <div className="gr-card">
                      <div className="gr-icon">💰</div>
                      <div className="gr-label">Amount Still Needed</div>
                      <div className="gr-value">{formatCurrency(goalResult.remaining)}</div>
                    </div>
                    <div className="gr-card">
                      <div className="gr-icon">📅</div>
                      <div className="gr-label">Timeline</div>
                      <div className="gr-value">{goalForm.months} months</div>
                    </div>
                  </div>
                  <div className="goal-tips">
                    <h4>💡 AI Tips for {goalForm.goalType}</h4>
                    <ul>
                      {goalResult.tips.map(tip => <li key={tip}>✅ {tip}</li>)}
                    </ul>
                  </div>
                  {formSubmitted && plan && goalResult.monthlySavingsNeeded > plan.monthlyAvailable && (
                    <div className="goal-warning">
                      ⚠️ Your monthly savings needed ({formatCurrency(goalResult.monthlySavingsNeeded)}) exceeds your available income ({formatCurrency(plan.monthlyAvailable)}). Consider extending your timeline or reducing the target.
                    </div>
                  )}
                  {formSubmitted && plan && goalResult.monthlySavingsNeeded <= plan.monthlyAvailable && (
                    <div className="goal-success">
                      ✅ Great news! You can comfortably achieve this goal with your current income. Your available {formatCurrency(plan.monthlyAvailable)}/month covers this goal!
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== INVESTMENTS TAB ===== */}
        {activeTab === 'Investments' && formSubmitted && plan && (
          <div className="tab-content animate-fade-up">
            <div className="investments-header glass-card">
              <div className="inv-header-left">
                <h2>📈 Investment Portfolio Suggestions</h2>
                <p>Based on your <strong style={{color:'var(--accent-primary)'}}>{financeForm.risk}</strong> risk appetite</p>
              </div>
              <div className="inv-monthly">
                <div className="inv-monthly-label">Invest Monthly</div>
                <div className="inv-monthly-value">{formatCurrency(plan.sipRange.max)}</div>
              </div>
            </div>

            <div className="investments-grid">
              {plan.investments.map((inv, i) => (
                <div key={inv.name} className="investment-card glass-card" style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="inv-top">
                    <div className="inv-icon">{inv.icon}</div>
                    <div className="inv-alloc" style={{color: 'var(--accent-primary)'}}>{inv.allocation}</div>
                  </div>
                  <div className="inv-name">{inv.name}</div>
                  <div className="inv-return">
                    <span className="badge badge-success">{inv.return}</span>
                  </div>
                  <div className="inv-amount">
                    ~{formatCurrency(Math.round(plan.sipRange.max * parseInt(inv.allocation) / 100))}/mo
                  </div>
                  <div className="inv-bar">
                    <div className="inv-bar-fill" style={{width: inv.allocation}} />
                  </div>
                </div>
              ))}
            </div>

            <div className="glass-card inv-disclaimer">
              <p>⚠️ <strong>Disclaimer:</strong> These suggestions are AI-generated based on your profile. Please consult a certified financial advisor (SEBI-registered) before making investment decisions. Past returns do not guarantee future performance.</p>
            </div>
          </div>
        )}

        {/* Empty state when not submitted */}
        {!formSubmitted && activeTab !== 'Overview' && (
          <div className="empty-state glass-card">
            <div className="empty-icon">🧮</div>
            <h3>Analyze Your Finances First</h3>
            <p>Fill in your financial details above and click "Analyze My Finances" to unlock {activeTab}.</p>
          </div>
        )}
      </main>

      {/* Floating Chat */}
      <ChatAssistant />
    </div>
  )
}
