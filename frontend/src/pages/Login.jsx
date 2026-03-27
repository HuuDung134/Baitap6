import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alert from '../components/Alert.jsx'
import Button from '../components/Button.jsx'
import Input from '../components/Input.jsx'
import useAuth from '../hooks/useAuth.js'
import { useNotifications } from '../contexts/NotificationContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const { notify } = useNotifications()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="text-xl font-semibold text-slate-900">NguyenHuuTienDung-2280600400</div>
        <div className="mt-1 text-sm text-slate-600">Sign in to continue.</div>

        {error ? <Alert className="mt-4" tone="error" title="Login failed">{error}</Alert> : null}

        <form
          className="mt-6 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault()
            setError('')
            setLoading(true)
            try {
              await login({ email, password })
              notify({ tone: 'success', title: 'Welcome', message: 'Login successful.' })
              navigate('/')
            } catch (err) {
              const msg = err?.response?.data?.message || err?.message || 'Please check your credentials.'
              setError(msg)
            } finally {
              setLoading(false)
            }
          }}
        >
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <Button loading={loading} className="w-full" type="submit">
            Login
          </Button>
        </form>

        <div className="mt-4 text-sm text-slate-600">
          No account?{' '}
          <Link className="font-medium text-indigo-700 hover:underline" to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}

