// ============================================================
// AUTH UTILITIES
// ============================================================

const USERS_KEY = 'amm_users'
const SESSION_KEY = 'amm_session'

export function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup({ name, email, password }) {
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered.' }
  }
  const newUser = { id: Date.now(), name, email, password, createdAt: new Date().toISOString() }
  users.push(newUser)
  saveUsers(users)
  setSession(newUser)
  return { success: true, user: newUser }
}

export function login({ email, password }) {
  const users = getUsers()
  const user = users.find(
    u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  )
  if (!user) return { success: false, error: 'Invalid email or password.' }
  setSession(user)
  return { success: true, user }
}

export function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, password: undefined }))
}

export function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY)) || null
  } catch {
    return null
  }
}

export function logout() {
  localStorage.removeItem(SESSION_KEY)
}

export function isAuthenticated() {
  return !!getSession()
}
