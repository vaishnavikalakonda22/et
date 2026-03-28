import { Link } from 'react-router-dom'
import { ArrowRight, Bot, TrendingUp, Target, Shield, Briefcase, Star, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Logo from '@/components/Logo'

const FEATURES = [
  { icon: Target, title: 'Money Health Score', desc: 'Get an instant financial health score based on your income, expenses, and savings ratio.', color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { icon: Bot, title: 'AI Chat Advisor', desc: 'Ask your AI Money Mentor anything — savings tips, investment strategies, debt management and more.', color: 'text-violet-400', bg: 'bg-violet-500/10' },
  { icon: TrendingUp, title: 'Smart Financial Plan', desc: 'Receive personalized SIP recommendations, budget breakdowns, and investment strategies.', color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { icon: Target, title: 'Goal Planner', desc: 'Set financial goals and get a step-by-step roadmap to achieve them on time.', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { icon: Shield, title: 'Emergency Fund Tracker', desc: 'Know exactly how much you need in your safety net and how fast you can build it.', color: 'text-rose-400', bg: 'bg-rose-500/10' },
  { icon: Briefcase, title: 'Investment Insights', desc: 'Risk-based portfolio suggestions tailored to your appetite — conservative to aggressive.', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
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

const STEPS = [
  { step: '01', title: 'Create Your Account', desc: 'Sign up free in under 30 seconds. No credit card required.', icon: '🔐' },
  { step: '02', title: 'Enter Your Finances', desc: 'Input your income, expenses, savings, and goals into the dashboard.', icon: '📊' },
  { step: '03', title: 'Get Your AI Plan', desc: 'Receive your health score, personalized plan, and investment strategy instantly.', icon: '🤖' },
]

export default function Landing() {
  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <Logo size={28} />
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {['Features', 'How it works', 'Stories'].map((label, i) => (
            <a
              key={label}
              href={['#features', '#how-it-works', '#testimonials'][i]}
              className="text-sm text-slate-400 hover:text-white transition-colors font-medium"
            >
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/login">Log in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link to="/signup">Get Started Free</Link>
          </Button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-6xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-sm font-medium mb-8 animate-fade-up">
              <Bot className="w-4 h-4" />
              Powered by AI Financial Intelligence
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 animate-fade-up">
              Your Personal<br />
              <span className="gradient-text">AI Money Mentor</span>
            </h1>

            <p className="text-xl text-slate-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up">
              Get a real-time financial health score, personalized investment plans, smart budgeting,
              and 24/7 AI chat advice — all in one clean dashboard.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up">
              <Button size="xl" asChild>
                <Link to="/signup">🚀 Start Your Financial Journey <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
              <Button variant="surface" size="xl" className="border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-white" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            <p className="mt-6 text-sm text-slate-500 animate-fade-up">Free forever · No credit card · Setup in 2 minutes</p>
          </div>

          {/* Hero mockup card */}
          <div className="relative max-w-md mx-auto animate-float">
            <Card className="p-6 glow-sky surface">
              <CardContent className="p-0 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Score ring */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <svg width="80" height="80" viewBox="0 0 80 80">
                        <circle cx="40" cy="40" r="33" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7"/>
                        <circle
                          cx="40" cy="40" r="33" fill="none"
                          stroke="url(#scoreGradSky)" strokeWidth="7"
                          strokeDasharray="207" strokeDashoffset="41"
                          strokeLinecap="round"
                          transform="rotate(-90 40 40)"
                        />
                        <defs>
                          <linearGradient id="scoreGradSky" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#0ea5e9"/>
                            <stop offset="100%" stopColor="#38bdf8"/>
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-white">80</span>
                        <span className="text-[9px] text-sky-400 font-bold uppercase tracking-wider mt-0.5">Excellent</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs font-medium text-slate-400">Income</span>
                        <span className="text-sm font-bold text-white">₹85,000</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs font-medium text-slate-400">Savings</span>
                        <span className="text-sm font-bold text-sky-400">₹22,000</span>
                      </div>
                      <div className="flex items-center justify-between gap-8">
                        <span className="text-xs font-medium text-slate-400">SIP</span>
                        <span className="text-sm font-bold text-blue-400">₹17,000</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget bars */}
                <div className="space-y-3 pt-2">
                  {[
                    { label: 'Needs', pct: 50, color: 'bg-indigo-400' },
                    { label: 'Wants', pct: 24, color: 'bg-amber-400' },
                    { label: 'Savings', pct: 26, color: 'bg-sky-400' },
                  ].map(b => (
                    <div key={b.label}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-medium text-slate-400">{b.label}</span>
                        <span className="text-xs font-bold text-slate-300">{b.pct}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className={`h-full ${b.color} rounded-full transition-all duration-1000`} style={{ width: `${b.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Floating chips */}
            <div className="absolute -right-4 top-4 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-semibold animate-float-delayed shadow-xl backdrop-blur-md whitespace-nowrap">
              📈 SIP: ₹17K/mo
            </div>
            <div className="absolute -left-8 bottom-8 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-semibold animate-float-delayed-2 shadow-xl backdrop-blur-md whitespace-nowrap">
              🛡️ Emergency Fund: 6mo
            </div>
            <div className="absolute -right-6 bottom-2 px-3.5 py-1.5 rounded-full bg-sky-500/20 border border-sky-500/30 text-sky-300 text-xs font-semibold animate-float shadow-xl backdrop-blur-md whitespace-nowrap">
              🎯 Goal: On Track!
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-12 px-6 border-y border-slate-800 bg-slate-900/30">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {STATS.map(s => (
            <div key={s.label}>
              <div className="text-3xl md:text-4xl font-black gradient-text-sky tracking-tight mb-2">{s.value}</div>
              <div className="text-sm font-medium text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-6" id="features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">✨ Features</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Everything You Need to <span className="gradient-text">Master Your Money</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">Powerful AI tools to analyze, plan, and grow your wealth seamlessly.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <Card key={f.title} className="p-6 group surface-hover">
                <CardContent className="p-0">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-slate-900/30 border-y border-slate-800" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">🗺️ Process</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Get Started in <span className="gradient-text">3 Simple Steps</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-gradient-to-r from-sky-500/50 to-blue-500/50" />

            {STEPS.map((s, i) => (
              <Card key={s.step} className="p-8 text-center relative group surface-hover">
                <CardContent className="p-0">
                  <div className="relative w-16 h-16 mx-auto mb-6">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/20 to-blue-500/20 group-hover:from-sky-500/30 group-hover:to-blue-500/30 transition-colors" />
                    <div className="relative flex items-center justify-center h-full text-3xl">{s.icon}</div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-sky-500 to-blue-500 flex items-center justify-center text-xs font-black text-white shadow-lg shadow-sky-500/30">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold tracking-tight text-white mb-3">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 px-6" id="testimonials">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">💬 Success Stories</Badge>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Real People, <span className="gradient-text-sky">Real Results</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <Card key={t.name} className="p-8 surface flex flex-col justify-between">
                <CardContent className="p-0">
                  <div className="flex gap-1 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-8 italic text-pretty">"{t.text}"</p>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500/20 to-blue-500/20 border border-sky-500/20 flex items-center justify-center text-lg">
                      {t.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-white">{t.name}</div>
                      <div className="text-xs font-medium text-slate-400">{t.role}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black gradient-text tracking-tighter leading-none">{t.score}</div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mt-0.5">Score</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-12 text-center bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 glow-sky relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <CardContent className="p-0 relative z-10">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-5">
                Ready to Transform Your <span className="gradient-text">Financial Life?</span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">Join thousands who've already improved their money health score with our AI intelligence.</p>
              <Button size="xl" className="shadow-sky-500/25" asChild>
                <Link to="/signup">🚀 Start Free Today <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 mt-10 text-sm font-medium text-slate-500">
                {['Free forever', 'No credit card needed', 'Setup in 2 minutes'].map(t => (
                  <div key={t} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-500" />
                    {t}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-10 px-6 border-t border-slate-800 bg-slate-900/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo showWordmark={true} size={24} />
          <p className="text-sm font-medium text-slate-500">© 2026 AI Money Mentor · Built securely</p>
        </div>
      </footer>
    </div>
  )
}
