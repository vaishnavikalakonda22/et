import { Link } from 'react-router-dom'
import './Landing.css'

const FEATURES = [
  { icon: '🎯', title: 'Money Health Score', desc: 'Get an instant financial health score based on your income, expenses, and savings ratio.' },
  { icon: '🤖', title: 'AI Chat Advisor', desc: 'Ask your AI Money Mentor anything — savings tips, investment strategies, debt management and more.' },
  { icon: '📈', title: 'Smart Financial Plan', desc: 'Receive personalized SIP recommendations, budget breakdowns, and investment strategies.' },
  { icon: '🏆', title: 'Goal Planner', desc: 'Set financial goals and get a step-by-step roadmap to achieve them on time.' },
  { icon: '🛡️', title: 'Emergency Fund Tracker', desc: 'Know exactly how much you need in your safety net and how fast you can build it.' },
  { icon: '💼', title: 'Investment Insights', desc: 'Risk-based portfolio suggestions tailored to your appetite — conservative to aggressive.' },
]

const STATS = [
  { value: '10K+', label: 'Users Mentored' },
  { value: '₹50Cr+', label: 'Wealth Optimized' },
  { value: '98%', label: 'Success Rate' },
  { value: '24/7', label: 'AI Availability' },
]

const TESTIMONIALS = [
  { name: 'Priya S.', role: 'Software Engineer', text: 'AI Money Mentor helped me go from zero savings to ₹2L in emergency fund within 8 months. The plan was crystal clear!', avatar: '👩‍💻', score: 84 },
  { name: 'Rahul M.', role: 'Freelancer', text: 'The SIP recommendations matched exactly what I needed. My score jumped from 32 to 71 in just 6 months!', avatar: '👨‍💼', score: 71 },
  { name: 'Ananya K.', role: 'Marketing Manager', text: 'Finally an app that speaks plain English. The budget breakdown was eye-opening — I was overspending on wants!', avatar: '👩‍🎨', score: 90 },
]

export default function Landing() {
  return (
    <div className="landing-page">
      {/* NAVBAR */}
      <nav className="landing-nav">
        <div className="nav-logo">
          <span className="logo-icon">💰</span>
          <span>AI Money <span className="gradient-text">Mentor</span></span>
        </div>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#testimonials">Stories</a>
        </div>
        <div className="nav-cta">
          <Link to="/login" className="btn btn-ghost btn-sm">Log in</Link>
          <Link to="/signup" className="btn btn-primary btn-sm">Get Started Free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>🤖</span> Powered by AI Financial Intelligence
        </div>
        <h1 className="hero-title">
          Your Personal<br />
          <span className="gradient-text">AI Money Mentor</span>
        </h1>
        <p className="hero-subtitle">
          Get a real-time financial health score, personalized investment plans, smart budgeting,
          and 24/7 AI chat advice — all in one beautiful dashboard.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn btn-primary btn-lg">
            🚀 Start Your Financial Journey
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Sign In
          </Link>
        </div>
        <p className="hero-note">Free forever · No credit card · Setup in 2 minutes</p>

        {/* Floating score card mockup */}
        <div className="hero-mockup">
          <div className="mockup-card glass-card">
            <div className="mockup-row">
              <div className="mockup-score-ring">
                <svg width="90" height="90" viewBox="0 0 90 90">
                  <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8"/>
                  <circle cx="45" cy="45" r="38" fill="none" stroke="#00d4aa" strokeWidth="7"
                    strokeDasharray="239" strokeDashoffset="48" strokeLinecap="round"
                    transform="rotate(-90 45 45)"/>
                </svg>
                <div className="mockup-score-text">
                  <span className="score-num">80</span>
                  <span className="score-lbl">Excellent</span>
                </div>
              </div>
              <div className="mockup-stats">
                <div className="mockup-stat"><span className="ms-label">Income</span><span className="ms-value">₹85,000</span></div>
                <div className="mockup-stat"><span className="ms-label">Savings</span><span className="ms-value" style={{color:'var(--accent-primary)'}}>₹22,000</span></div>
                <div className="mockup-stat"><span className="ms-label">SIP</span><span className="ms-value" style={{color:'var(--accent-secondary)'}}>₹17,000</span></div>
              </div>
            </div>
            <div className="mockup-bar-row">
              <div className="mockup-bar-item">
                <div className="bar-label"><span>Needs</span><span>50%</span></div>
                <div className="bar-track"><div className="bar-fill needs" style={{width:'50%'}}></div></div>
              </div>
              <div className="mockup-bar-item">
                <div className="bar-label"><span>Wants</span><span>24%</span></div>
                <div className="bar-track"><div className="bar-fill wants" style={{width:'24%'}}></div></div>
              </div>
              <div className="mockup-bar-item">
                <div className="bar-label"><span>Savings</span><span>26%</span></div>
                <div className="bar-track"><div className="bar-fill savings" style={{width:'26%'}}></div></div>
              </div>
            </div>
          </div>
          {/* Floating chips */}
          <div className="floating-chip chip-1">📈 SIP: ₹17K/mo</div>
          <div className="floating-chip chip-2">🛡️ Emergency Fund: 6mo</div>
          <div className="floating-chip chip-3">🎯 Goal: On Track!</div>
        </div>
      </section>

      {/* STATS */}
      <section className="stats-section">
        {STATS.map(s => (
          <div key={s.label} className="stat-item">
            <span className="stat-value gradient-text">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-header">
          <div className="section-badge">✨ Features</div>
          <h2>Everything You Need to <span className="gradient-text">Master Your Money</span></h2>
          <p>Powerful AI tools to analyze, plan, and grow your wealth.</p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f => (
            <div key={f.title} className="feature-card glass-card">
              <div className="feat-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-header">
          <div className="section-badge">🗺️ Process</div>
          <h2>Get Started in <span className="gradient-text">3 Simple Steps</span></h2>
        </div>
        <div className="steps-row">
          {[
            { step: '01', title: 'Create Your Account', desc: 'Sign up free in under 30 seconds. No credit card required.' },
            { step: '02', title: 'Enter Your Finances', desc: 'Input your income, expenses, savings, and goals into the dashboard.' },
            { step: '03', title: 'Get Your AI Plan', desc: 'Receive your health score, personalized plan, and investment strategy instantly.' },
          ].map((s, i) => (
            <div key={s.step} className="step-card glass-card">
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              {i < 2 && <div className="step-arrow">→</div>}
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section" id="testimonials">
        <div className="section-header">
          <div className="section-badge">💬 Success Stories</div>
          <h2>Real People, <span className="gradient-text">Real Results</span></h2>
        </div>
        <div className="testimonials-grid">
          {TESTIMONIALS.map(t => (
            <div key={t.name} className="testimonial-card glass-card">
              <div className="t-stars">⭐⭐⭐⭐⭐</div>
              <p className="t-text">"{t.text}"</p>
              <div className="t-bottom">
                <div className="t-avatar">{t.avatar}</div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
                <div className="t-score" style={{marginLeft:'auto'}}>
                  <span className="score-badge">{t.score}</span>
                  <span style={{fontSize:'0.7rem',color:'var(--text-muted)'}}>Score</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="cta-card glass-card">
          <h2>Ready to Transform Your <span className="gradient-text">Financial Life?</span></h2>
          <p>Join thousands who've already improved their money health score.</p>
          <Link to="/signup" className="btn btn-primary btn-lg">
            🚀 Start Free Today — No Credit Card
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-logo">
          <span>💰</span> AI Money <span className="gradient-text">Mentor</span>
        </div>
        <p>© 2025 AI Money Mentor · Built for ET Gen AI Hackathon 2026</p>
      </footer>
    </div>
  )
}
