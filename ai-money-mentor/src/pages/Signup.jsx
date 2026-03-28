import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signup } from '../utils/auth'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

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

    if (!result.success) {
      setServerError(result.error)
    } else {
      navigate('/dashboard')
    }
  }

  const strength = () => {
    if (!form.password) return 0
    let s = 0
    if (form.password.length >= 6) s++
    if (form.password.length >= 10) s++
    if (/[A-Z]/.test(form.password)) s++
    if (/[0-9]/.test(form.password)) s++
    if (/[^A-Za-z0-9]/.test(form.password)) s++
    return s
  }

  const pw = strength()
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][pw]
  const strengthColor = ['', '#ff4d6d', '#ffb703', '#f5c842', '#00d4aa', '#06d6a0'][pw]

  return (
    <div className="auth-page">
      <div className="auth-orb orb-1" />
      <div className="auth-orb orb-2" />

      <div className="auth-container">
        <Link to="/" className="auth-logo">
          <span>💰</span>
          <span>AI Money <span className="gradient-text">Mentor</span></span>
        </Link>

        <div className="auth-card glass-card">
          <div className="auth-header">
            <h1>Create your account</h1>
            <p>Start your financial transformation today</p>
          </div>

          {serverError && (
            <div className="auth-alert error">⚠️ {serverError}</div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="auth-form-body">
              <div className="form-group">
                <label className="form-label" htmlFor="signup-name">Full Name</label>
                <input
                  id="signup-name"
                  name="name"
                  type="text"
                  className={`form-input ${errors.name ? 'input-error' : ''}`}
                  placeholder="Priya Sharma"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
                {errors.name && <span className="form-error">⚠ {errors.name}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-email">Email address</label>
                <input
                  id="signup-email"
                  name="email"
                  type="email"
                  className={`form-input ${errors.email ? 'input-error' : ''}`}
                  placeholder="priya@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {errors.email && <span className="form-error">⚠ {errors.email}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-password">Password</label>
                <input
                  id="signup-password"
                  name="password"
                  type="password"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  placeholder="Min 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {form.password && (
                  <div className="pw-strength">
                    <div className="pw-bars">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className="pw-bar" style={{ background: i <= pw ? strengthColor : 'rgba(255,255,255,0.08)' }} />
                      ))}
                    </div>
                    <span style={{ color: strengthColor, fontSize: '0.75rem', fontWeight: 600 }}>{strengthLabel}</span>
                  </div>
                )}
                {errors.password && <span className="form-error">⚠ {errors.password}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="signup-confirm">Confirm Password</label>
                <input
                  id="signup-confirm"
                  name="confirm"
                  type="password"
                  className={`form-input ${errors.confirm ? 'input-error' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                {errors.confirm && <span className="form-error">⚠ {errors.confirm}</span>}
              </div>

              <button type="submit" className="btn btn-primary w-full" disabled={loading}>
                {loading ? <><span className="spinner" /> Creating account...</> : '🚀 Create Account Free'}
              </button>
            </div>
          </form>

          <p className="auth-terms">
            By signing up, you agree to our <span className="auth-link">Terms</span> and <span className="auth-link">Privacy Policy</span>.
          </p>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login" className="auth-link">Sign in →</Link>
          </p>
        </div>

        <div className="auth-trust">
          <span>🔒 Encrypted</span>
          <span>📱 No spam</span>
          <span>✅ Free forever</span>
        </div>
      </div>
    </div>
  )
}
