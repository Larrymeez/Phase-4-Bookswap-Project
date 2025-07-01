import React, { useContext } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { AuthContext } from '../context/AuthContext'

const Login = () => {
  const { login } = useContext(AuthContext)

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      })

      const data = await res.json()
      if (res.ok) {
        login(data.token, data.is_admin)
        alert('Login successful!')
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (err) {
      console.error(err)
      alert('Error logging in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #fdf6e3, #e0c097)',
        fontFamily: "'Georgia', serif"
      }}
    >
      <div
        className="p-5 rounded shadow"
        style={{
          backgroundColor: '#fffaf0',
          border: '2px solid #deb887',
          width: '100%',
          maxWidth: '420px',
        }}
      >
        <h2 className="text-center mb-4" style={{ color: '#8B0000' }}>
          🔐 Login to <span style={{ color: '#A0522D' }}>BookSwap</span>
        </h2>

        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().min(6, 'Minimum 6 characters').required('Required')
          })}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label fw-semibold">Username</label>
                <Field name="username" className="form-control" placeholder="e.g. booklover123" />
                <ErrorMessage name="username" component="div" className="text-danger small" />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Password</label>
                <Field name="password" type="password" className="form-control" placeholder="Enter password" />
                <ErrorMessage name="password" component="div" className="text-danger small" />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn w-100"
                style={{
                  backgroundColor: '#8B0000',
                  color: 'white',
                  borderRadius: '10px'
                }}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}

export default Login
