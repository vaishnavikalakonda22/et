import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../utils/auth'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

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
    // Simulate slight delay for realism
    await new Promise(r => setTimeout(r, 800))

    const result = login({ email: form.email, password: form.password })
    setLoading(false)

    if (!result.success) {
      setServerError(result.error)
    } else {
      navigate('/dashboard')
    }
  }

  const fillDemo = () => {
    setForm({ email: 'demo@moneym.ai', password: 'demo1234' })
    setErrors({})
    setServerError('')
  }

  return (
    <div className="auth-page">
      {/* Background orbs */}
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />

      <div className="auth-container">
        {/* Logo */}
        <Link to="/" className="auth-logo">
          <span>💰</span>
          <span>AI Money <span className="gradient-text">Mentor</span></span>
        </Link>

        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Welcome back</h1>
            <p>Sign in to your financial dashboard</p>
          </div>

          {serverError && (
            <div className="auth-alert error">
              ⚠️ {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-body">
              <div className="form-group">
                <label className="form-label" htmlFor="login-email">Email address</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="login-password">Password</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                />
                {errors.password && <span className="form-error">⚠ {errors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <><span className="spinner" /> Signing in...</> : '🔐 Sign In'}
              </button>
            </div>
          </form>

          <div className="divider">or</div>

          <button className="btn btn-ghost w-full" onClick={fillDemo}>
            🎮 Try Demo Account
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/signup" className="auth-link">Create one free →</Link>
          </p>
        </div>

        {/* Trust badges */}
        <div className="auth-trust">
          <span>🔒 Encrypted</span>
          <span>📱 No spam</span>
          <span>✅ Free forever</span>
        </div>
      </div>
    </div>
  )
}
