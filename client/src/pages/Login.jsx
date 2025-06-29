import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const Login = () => {
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        alert('Login successful!')
        // redirect logic will go here
      } else {
        alert(data.error || 'Login failed')
      }
    } catch (err) {
      alert('Error logging in')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Login</h2>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={Yup.object({
          username: Yup.string().required('Required'),
          password: Yup.string().min(6, 'Minimum 6 characters').required('Required')
        })}
        onSubmit={handleSubmit}
      >
        <Form className="flex flex-col gap-2">
          <Field name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <button type="submit">Login</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Login
