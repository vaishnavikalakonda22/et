import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Loader2, Eye, EyeOff, AlertCircle } from 'lucide-react'
import { login } from '../utils/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Logo from '@/components/Logo'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
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
    const result = login({ email: form.email, password: form.password })
    setLoading(false)

    if (!result.success) setServerError(result.error)
    else navigate('/dashboard')
  }

  const fillDemo = () => {
    setForm({ email: 'demo@moneym.ai', password: 'demo1234' })
    setErrors({})
    setServerError('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-16 relative overflow-hidden bg-slate-950">
      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center mb-8 hover:opacity-80 transition-opacity">
          <Logo size={36} />
        </Link>

        <Card className="surface">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
            <CardDescription className="text-slate-400">Sign in to your financial dashboard</CardDescription>
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
                <Label htmlFor="login-email" className="text-slate-300">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    className={`pl-10 ${errors.email ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <Input
                    id="login-password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500/50 focus-visible:ring-red-500' : ''}`}
                    placeholder="Your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => setShowPw(v => !v)}
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-400 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" disabled={loading} size="lg">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : '🔐 Sign In'}
              </Button>
            </form>

            <div className="relative flex items-center gap-3 py-2">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <Button variant="secondary" className="w-full" onClick={fillDemo} size="lg">
              🎮 Try Demo Account
            </Button>

            <p className="text-center text-sm font-medium text-slate-400 pt-2">
              Don't have an account?{' '}
              <Link to="/signup" className="text-sky-400 hover:text-sky-300 transition-colors">
                Create one free →
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs font-medium text-slate-500">
          <span className="flex items-center gap-1.5">🔒 Encrypted</span>
          <span className="flex items-center gap-1.5">📱 No spam</span>
          <span className="flex items-center gap-1.5">✅ Free forever</span>
        </div>
      </div>
    </div>
  )
}
