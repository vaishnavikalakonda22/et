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
// HEALTH SCORE (6 DIMENSIONS)
// ============================================================
export function calculateHealthScore(form) {
  const i = +(form.income || 0)
  const e = +(form.expenses || 0)
  const s = +(form.savings || 0)
  const monthlyEmi = +(form.emis || 0)

  if (i <= 0) return { score: 0, label: 'Unknown', color: 'var(--text-muted)', tier: 'unknown', dimensions: [], ratio: 0 }

  // 1. Emergency Preparedness (Aim: 6 months)
  const monthsOfBuffer = s / (e + 0.001)
  const emergencyScore = Math.min(100, (monthsOfBuffer / 6) * 100)

  // 2. Insurance Coverage
  let insScore = 0
  if (form.healthInsurance) insScore += 50
  if (form.lifeInsurance) insScore += 50

  // 3. Investment Diversification (Savings Rate)
  const savingsRate = (i - e - monthlyEmi) / i
  const invScore = Math.max(0, Math.min(100, (savingsRate / 0.20) * 100))

  // 4. Debt Health (EMI / Income threshold 40%)
  const debtToIncome = monthlyEmi / i
  const debtScore = Math.max(0, 100 - (debtToIncome / 0.40 * 100))

  // 5. Tax Efficiency
  const taxScore = form.utilizingTax80c ? 100 : 30

  // 6. Retirement Readiness
  const retScore = form.investingForRetirement ? 100 : 20

  const totalScore = Math.round((emergencyScore + insScore + invScore + debtScore + taxScore + retScore) / 6)

  const dimensions = [
    { subject: 'Emergency', A: Math.round(emergencyScore), fullMark: 100 },
    { subject: 'Insurance', A: Math.round(insScore), fullMark: 100 },
    { subject: 'Investments', A: Math.round(invScore), fullMark: 100 },
    { subject: 'Debt Health', A: Math.round(debtScore), fullMark: 100 },
    { subject: 'Tax Effic.', A: Math.round(taxScore), fullMark: 100 },
    { subject: 'Retirement', A: Math.round(retScore), fullMark: 100 }
  ]

  let label = 'Excellent'
  let tier = 'good'
  let color = '#0ea5e9' // Sky 500

  if (totalScore < 40) {
    label = 'Critical Warning'
    tier = 'poor'
    color = '#ef4444' // Red 500
  } else if (totalScore < 70) {
    label = 'Needs Work'
    tier = 'average'
    color = '#f59e0b' // Amber 500
  }

  return { score: totalScore, label, color, tier, dimensions, ratio: savingsRate }
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
  const withGrowth = Math.ceil(remaining / (timelineMonths * (1 + 0.01 * 0.5)))

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
// TAX CALCULATOR
// ============================================================
export function calculateTax(baseSalary, hraReceived, monthlyRent, deduction80c, deduction80d, homeLoanInt) {
  const standardDeduction = 50000;
  const grossSalary = baseSalary + hraReceived;

  // HRA Exemption logic (simplified)
  const rentPaid = monthlyRent * 12;
  const excessRent = Math.max(0, rentPaid - (0.10 * baseSalary));
  const hraExemption = Math.min(hraReceived, excessRent);

  const netDeduction80c = Math.min(150000, deduction80c);
  // Max 2L for home loan self-occupied
  const netHomeLoanInt = Math.min(200000, homeLoanInt);

  // OLD TAX REGIME (Allows deductions)
  const oldTaxableBase = grossSalary - hraExemption - standardDeduction - netDeduction80c - deduction80d - netHomeLoanInt;
  const oldTaxable = Math.max(0, oldTaxableBase);

  let oldTax = 0;
  if (oldTaxable > 1000000) oldTax = 112500 + (oldTaxable - 1000000) * 0.3;
  else if (oldTaxable > 500000) oldTax = 12500 + (oldTaxable - 500000) * 0.2;
  else if (oldTaxable > 250000) oldTax = (oldTaxable - 250000) * 0.05;
  
  // Rebate Under 87A for Old Regime (No tax if <= 5L)
  if (oldTaxable <= 500000) oldTax = 0;
  oldTax = oldTax * 1.04; // 4% Health & Education Cess

  // NEW TAX REGIME (Only Standard Deduction allowed)
  const newTaxableBase = grossSalary - standardDeduction;
  const newTaxable = Math.max(0, newTaxableBase);

  let newTax = 0;
  if (newTaxable > 1500000) newTax = 150000 + (newTaxable - 1500000) * 0.3;
  else if (newTaxable > 1200000) newTax = 90000 + (newTaxable - 1200000) * 0.2;
  else if (newTaxable > 900000) newTax = 45000 + (newTaxable - 900000) * 0.15;
  else if (newTaxable > 600000) newTax = 15000 + (newTaxable - 600000) * 0.1;
  else if (newTaxable > 300000) newTax = (newTaxable - 300000) * 0.05;

  // Rebate under 87A for New Regime (No tax if <= 7L)
  if (newTaxable <= 700000) newTax = 0;
  newTax = newTax * 1.04;

  const winner = newTax <= oldTax ? 'New Tax Regime' : 'Old Tax Regime';
  const savingsAmt = Math.abs(oldTax - newTax);

  return {
    oldTax: Math.round(oldTax),
    newTax: Math.round(newTax),
    oldTaxable: Math.round(oldTaxable),
    newTaxable: Math.round(newTaxable),
    winner,
    savingsAmt: Math.round(savingsAmt)
  }
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
