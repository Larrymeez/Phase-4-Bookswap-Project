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
