import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useUserStore } from '../stores/useUserStore'

import { Toaster } from 'react-hot-toast'

const SignUp = () => {
  const { signup } = useUserStore()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    signup(formData)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }
  return (
    <div className='flex items-center justify-center min-h-screen p-4'>
      <form
        className='w-full max-w-md bg-gray-800 rounded-lg shadow-md p-8'
        onSubmit={handleSubmit}
      >
        <h2 className='text-2xl font-bold mb-6 text-center text-emerald-500'>
          Sign Up
        </h2>
        <div className='space-y-4'>
          <div>
            <label htmlFor='name' className='block text-sm font-medium mb-1'>
              Name
            </label>
            <input
              type='text'
              id='name'
              placeholder='John Doe'
              className='w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor='email' className='block text-sm font-medium mb-1'>
              Email
            </label>
            <input
              type='email'
              id='email'
              placeholder='johndoe@example.com'
              className='w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium mb-1'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              placeholder='••••••••'
              className='w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium mb-1'
            >
              Confirm Password
            </label>
            <input
              type='password'
              id='confirmPassword'
              placeholder='••••••••'
              className='w-full px-3 py-2 bg-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500'
              onChange={handleChange}
            />
          </div>
        </div>
        <button
          type='submit'
          className='w-full bg-emerald-600 text-white rounded-md py-2 px-4 mt-6 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800'
        >
          Sign Up
        </button>
        <p className='text-center mt-4'>
          Already have account?{' '}
          <span className='text-emerald-500'>
            <Link to='/login'>Login</Link>
          </span>
        </p>
      </form>
      <Toaster />
    </div>
  )
}

export default SignUp
