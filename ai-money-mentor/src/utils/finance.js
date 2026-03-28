// ============================================================
// FINANCE UTILITIES
// ============================================================

const FINANCE_KEY = 'amm_finance_'

export function saveFinanceData(userId, data) {
  localStorage.setItem(FINANCE_KEY + userId, JSON.stringify(data))
}

export function getFinanceData(userId) {
  try {
    return JSON.parse(localStorage.getItem(FINANCE_KEY + userId)) || null
  } catch {
    return null
  }
}

// ============================================================
// HEALTH SCORE
// ============================================================
export function calculateHealthScore(income, expenses, savings) {
  if (!income || income <= 0) return { score: 0, label: 'Unknown', color: 'var(--text-muted)', tier: 'unknown' }

  const savingsRatio = (income - expenses) / income
  const savingsBuffer = savings / expenses // months of emergency fund

  let baseScore = Math.max(0, Math.min(100, savingsRatio * 200))

  // Bonus for emergency fund
  if (savingsBuffer >= 6) baseScore = Math.min(100, baseScore + 10)
  else if (savingsBuffer >= 3) baseScore = Math.min(100, baseScore + 5)

  // Bonus for positive savings
  if (savings > 0) baseScore = Math.min(100, baseScore + 5)

  const score = Math.round(baseScore)

  if (savingsRatio < 0.2) {
    return { score, label: 'Needs Attention', color: 'var(--accent-danger)', tier: 'poor', ratio: savingsRatio }
  } else if (savingsRatio < 0.4) {
    return { score, label: 'Average', color: 'var(--accent-warning)', tier: 'average', ratio: savingsRatio }
  } else {
    return { score, label: 'Excellent', color: 'var(--accent-primary)', tier: 'good', ratio: savingsRatio }
  }
}

// ============================================================
// FINANCIAL PLAN
// ============================================================
export function generateFinancialPlan(income, expenses, savings, risk, goal) {
  const monthlyAvailable = income - expenses
  const sipMin = Math.round(income * 0.20)
  const sipMax = Math.round(income * 0.30)
  const emergencyFundTarget = expenses * 6
  const emergencyFundNeeded = Math.max(0, emergencyFundTarget - savings)
  const monthsToEmergency = emergencyFundNeeded > 0
    ? Math.ceil(emergencyFundNeeded / (monthlyAvailable * 0.5))
    : 0

  const budgetBreakdown = {
    needs: Math.round(income * 0.50),
    wants: Math.round(income * 0.30),
    savings: Math.round(income * 0.20),
  }

  let investments = []
  if (risk === 'Low') {
    investments = [
      { name: 'Fixed Deposits (FD)', allocation: '40%', return: '6-7% p.a.', icon: '🏦' },
      { name: 'Public Provident Fund (PPF)', allocation: '30%', return: '7.1% p.a.', icon: '📊' },
      { name: 'Debt Mutual Funds', allocation: '20%', return: '7-8% p.a.', icon: '📈' },
      { name: 'Gold ETF', allocation: '10%', return: '8-10% p.a.', icon: '🥇' },
    ]
  } else if (risk === 'Medium') {
    investments = [
      { name: 'Index Funds (Nifty 50)', allocation: '35%', return: '12-14% p.a.', icon: '📈' },
      { name: 'Large Cap Mutual Funds', allocation: '25%', return: '12-15% p.a.', icon: '💼' },
      { name: 'Corporate Bonds', allocation: '25%', return: '8-10% p.a.', icon: '📋' },
      { name: 'Gold ETF', allocation: '15%', return: '8-10% p.a.', icon: '🥇' },
    ]
  } else {
    investments = [
      { name: 'Small/Mid Cap Funds', allocation: '40%', return: '15-20% p.a.', icon: '🚀' },
      { name: 'Direct Equity', allocation: '30%', return: '15-25% p.a.', icon: '📊' },
      { name: 'Crypto (small allocation)', allocation: '10%', return: 'High volatility', icon: '₿' },
      { name: 'Index Funds', allocation: '20%', return: '12-14% p.a.', icon: '📈' },
    ]
  }

  return {
    sipRange: { min: sipMin, max: sipMax },
    emergencyFund: { target: emergencyFundTarget, needed: emergencyFundNeeded, months: monthsToEmergency },
    budgetBreakdown,
    investments,
    monthlyAvailable,
  }
}

// ============================================================
// GOAL PLANNER
// ============================================================
export function calculateGoalPlan(goal, targetAmount, timelineMonths, currentSavings) {
  const remaining = Math.max(0, targetAmount - currentSavings)
  const monthlySavingsNeeded = timelineMonths > 0 ? Math.ceil(remaining / timelineMonths) : remaining
  const withGrowth = Math.ceil(remaining / (timelineMonths * (1 + 0.01 * 0.5))) // rough SIP estimate

  let tips = []
  if (goal === 'Emergency Fund') {
    tips = ['Start with a high-yield savings account', 'Automate monthly transfers', 'Keep funds liquid and accessible']
  } else if (goal === 'House / Property') {
    tips = ['Consider home loan EMI ≤ 40% of income', 'Save for 20% down payment', 'Research government housing schemes']
  } else if (goal === 'Retirement') {
    tips = ['Start a NPS or PPF account today', 'Increase savings rate by 1% each year', 'Diversify across equity and debt']
  } else if (goal === 'Education') {
    tips = ['Look into education loan options', 'Invest in debt funds for stability', 'Plan for inflation in tuition costs']
  } else {
    tips = ['Break goal into monthly milestones', 'Automate savings on payday', 'Track progress monthly']
  }

  return { monthlySavingsNeeded, withGrowth, remaining, tips }
}

// ============================================================
// FORMAT HELPERS
// ============================================================
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return '₹0'
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatNumber(n) {
  if (n >= 10000000) return (n / 10000000).toFixed(1) + ' Cr'
  if (n >= 100000) return (n / 100000).toFixed(1) + ' L'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return n?.toString() || '0'
}
