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
        alert('📚 Book added successfully!')
        resetForm()
      } else {
        alert(res.error || '❌ Failed to add book')
      }
    } catch (err) {
      alert('⚠️ Error submitting book.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-[#fdf6ec] border border-amber-300 rounded-lg shadow-md">
      <h2 className="text-2xl font-serif font-semibold text-amber-800 mb-6">Add a New Book</h2>
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
        {({ isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <Field
              name="title"
              placeholder="Book Title"
              className="border border-amber-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <ErrorMessage
              name="title"
              component="div"
              className="text-rose-600 text-sm"
            />

            <Field
              name="author"
              placeholder="Author"
              className="border border-amber-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <ErrorMessage
              name="author"
              component="div"
              className="text-rose-600 text-sm"
            />

            <Field
              name="genre"
              placeholder="Genre"
              className="border border-amber-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <ErrorMessage
              name="genre"
              component="div"
              className="text-rose-600 text-sm"
            />

            <Field
              name="condition"
              placeholder="Condition (e.g., Good, Fair)"
              className="border border-amber-400 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <ErrorMessage
              name="condition"
              component="div"
              className="text-rose-600 text-sm"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-amber-700 hover:bg-amber-800 text-black font-semibold py-2 rounded transition"
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AddBook

