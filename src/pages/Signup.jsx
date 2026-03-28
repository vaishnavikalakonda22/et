import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { signup } from '../utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Logo from '@/components/Logo'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirm) e.confirm = 'Please confirm your password'
    else if (form.confirm !== form.password) e.confirm = 'Passwords do not match'
    return e
  }

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
    setErrors(er => ({ ...er, [e.target.name]: '' }))
    setServerError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    const result = signup({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    setLoading(false)

    if (!result.success) setServerError(result.error)
    else navigate('/dashboard')
  }

  const getPasswordStrength = () => {
    if (!form.password) return { score: 0, label: '', color: '' }
    let s = 0
    if (form.password.length >= 6) s++
    if (form.password.length >= 10) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    const configs = [
      { label: '', color: '' },
      { label: 'Weak', color: 'text-red-400' },
      { label: 'Fair', color: 'text-amber-400' },
      { label: 'Good', color: 'text-yellow-400' },
      { label: 'Strong', color: 'text-sky-400' },
      { label: 'Very Strong', color: 'text-blue-400' },
    ]
    const barColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-yellow-400', 'bg-sky-400', 'bg-blue-400']
    return { score: s, ...configs[s], barColor: barColors[s] }
  }

  const pw = getPasswordStrength()

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>

        <Card className="surface">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Create your account</CardTitle>
            <CardDescription className="text-slate-400">Start your financial transformation today</CardDescription>
          </CardHeader>

          <CardContent className="pt-6 space-y-5">
            {serverError && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="signup-name" className="text-slate-300">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="signup-name"
                    name="name"
                    type="text"
                    className={`pl-10 ${errors.name ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="Priya Sharma"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-email" className="text-slate-300">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="signup-email"
                    name="email"
                    type="email"
                    className={`pl-10 ${errors.email ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="signup-password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="Min 6 characters"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowPw(v => !v)}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {form.password && (
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex gap-1 flex-1">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${i <= pw.score ? pw.barColor || 'bg-sky-400' : 'bg-slate-800'}`}
                        />
                      ))}
                    </div>
                    {pw.label && <span className={`text-xs font-semibold ${pw.color} w-20 text-right`}>{pw.label}</span>}
                  </div>
                )}
                {errors.password && <p className="text-xs text-red-400 flex items-center gap-1 mt-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="signup-confirm" className="text-slate-300">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="signup-confirm"
                    name="confirm"
                    type={showConfirm ? 'text' : 'password'}
                    className={`pl-10 pr-10 ${errors.confirm ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="Repeat your password"
                    value={form.confirm}
                    onChange={handleChange}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowConfirm(v => !v)}
                  >
                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirm && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full mt-2" disabled={loading} size="lg">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : '🚀 Create Account Free'}
              </Button>
            </form>

            <p className="text-center text-xs font-medium text-slate-500 pt-2">
              By signing up, you agree to our{' '}
              <span className="text-sky-400 cursor-pointer hover:text-sky-300 transition-colors">Terms</span> and{' '}
              <span className="text-sky-400 cursor-pointer hover:text-sky-300 transition-colors">Privacy Policy</span>.
            </p>

            <div className="w-full h-px bg-slate-800 my-2" />

            <p className="text-center text-sm font-medium text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 hover:text-sky-300 transition-colors">
                Sign in →
              </Link>
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">🔒 Encrypted</span>
          <span className="flex items-center gap-1.5">📱 No spam</span>
          <span className="flex items-center gap-1.5">✅ Free forever</span>
        </div>
      </div>
    </div>
  )
}
