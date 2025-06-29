import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'

const Signup = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await fetch('http://127.0.0.1:5001/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      })

      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        alert('Signup successful!')
        resetForm()
      } else {
        alert(data.error || 'Signup failed')
      }
    } catch (err) {
      alert('Error signing up')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Signup</h2>
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
        <Form className="flex flex-col gap-2">
          <Field name="username" placeholder="Username" />
          <ErrorMessage name="username" component="div" />
          <Field name="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
          <Field type="password" name="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <Field name="location" placeholder="Location (optional)" />
          <button type="submit">Sign Up</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Signup
