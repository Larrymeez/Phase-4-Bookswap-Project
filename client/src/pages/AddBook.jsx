import React from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { authorizedFetch } from '../utils/api'

const AddBook = () => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const res = await authorizedFetch('http://127.0.0.1:5000/books', {
        method: 'POST',
        body: JSON.stringify(values)
      })

      if (res.id) {
        alert('Book added successfully!')
        resetForm()
      } else {
        alert(res.error || 'Failed to add book')
      }
    } catch (err) {
      alert('Error submitting book.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-xl mb-4">Add a New Book</h2>
      <Formik
        initialValues={{
          title: '',
          author: '',
          genre: '',
          condition: ''
        }}
        validationSchema={Yup.object({
          title: Yup.string().required('Title is required'),
          author: Yup.string().required('Author is required'),
          genre: Yup.string().required('Genre is required'),
          condition: Yup.string().required('Condition is required')
        })}
        onSubmit={handleSubmit}
      >
        <Form className="flex flex-col gap-3">
          <Field name="title" placeholder="Book Title" />
          <ErrorMessage name="title" component="div" className="text-red-500" />

          <Field name="author" placeholder="Author" />
          <ErrorMessage name="author" component="div" className="text-red-500" />

          <Field name="genre" placeholder="Genre" />
          <ErrorMessage name="genre" component="div" className="text-red-500" />

          <Field name="condition" placeholder="Condition (e.g., Good, Fair)" />
          <ErrorMessage name="condition" component="div" className="text-red-500" />

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Submit
          </button>
        </Form>
      </Formik>
    </div>
  )
}

export default AddBook
