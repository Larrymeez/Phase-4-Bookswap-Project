import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const Signup = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        alert('✅ Signup successful!')
        resetForm()
      } else {
        alert(data.error || '❌ Signup failed')
      }
    } catch (err) {
      alert('❌ Error signing up')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-amber-700 mb-6 tracking-wide text-center">
        ✍️ Create Your Account
      </h2>
      <Formik
        initialValues={{ username: '', email: '', password: '', location: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          email: Yup.string().email('Invalid email').required('Required'),
          password: Yup.string().min(6).required('Required'),
          location: Yup.string()
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div>
              <Field
                name="username"
                placeholder="Username"
                className="w-full border border-zinc-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
              />
              <ErrorMessage
                name="username"
                component="div"
                className="text-rose-600 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="email"
                placeholder="Email"
                className="w-full border border-zinc-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-rose-600 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border border-zinc-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
              />
              <ErrorMessage
                name="password"
                component="div"
                className="text-rose-600 text-sm mt-1"
              />
            </div>

            <div>
              <Field
                name="location"
                placeholder="Location (optional)"
                className="w-full border border-zinc-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
              />
              <ErrorMessage
                name="location"
                component="div"
                className="text-rose-600 text-sm mt-1"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-700 hover:bg-amber-800 text-red px-6 py-2 rounded-xl font-semibold transition shadow"
            >
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Signup

