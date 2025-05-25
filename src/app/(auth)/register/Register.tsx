'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'

import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { AiOutlineGoogle } from 'react-icons/ai'

import Input from '@/components/input/Input'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'

import type { SafeUser } from '@/type/SafeUser'
import { signIn } from 'next-auth/react'

interface RegisterProps {
  currentUser: SafeUser | null
}

const Register: React.FC<RegisterProps> = ({ currentUser }) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (currentUser) {
      toast('You are already logged in.')
      router.push('/cart')
      router.refresh()
    }
  }, [currentUser, router])

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true)

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || 'Registration failed')
      }

      toast.success('Registered successfully!')

      const loginResult = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (loginResult?.ok) {
        toast.success('Logged in!')
        router.push('/cart')
        router.refresh()
      } else if (loginResult?.error) {
        toast.error('Login failed. Please check your credentials.')
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error(error)
        toast.error(error.message || 'Something went wrong!')
      } else {
        console.error('Unexpected error', error)
        toast.error('An unexpected error occurred!')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    const result = await signIn('google', { redirect: false })
    if (result?.ok) {
      toast.success('Signed in with Google!')
      router.push('/cart')
      router.refresh()
    } else {
      toast.error('Google sign-in failed!')
    }
    setIsLoading(false)
  }

  return (
    <div className="max-w-md mx-auto space-y-6 mt-10">
      <Heading text="Sign Up" level={3} gradient />

      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          required: 'Name is required',
          minLength: {
            value: 2,
            message: 'Name must be at least 2 characters',
          },
          maxLength: {
            value: 50,
            message: 'Name must be less than 50 characters',
          },
          pattern: {
            value: /^[a-zA-Z\s-]+$/,
            message: 'Name can only contain letters, spaces, or hyphens',
          },
        }}
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          required: 'Email is required',
          pattern: {
            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            message: 'Please enter a valid email address',
          },
          maxLength: {
            value: 100,
            message: 'Email must be less than 100 characters',
          },
        }}
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          required: 'Password is required',
          minLength: {
            value: 8,
            message: 'Password must be at least 8 characters',
          },
          maxLength: {
            value: 50,
            message: 'Password must be less than 50 characters',
          },
          pattern: {
            value:
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
            message:
              'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
          },
        }}
        showPasswordToggle
      />

      <Button
        label={isLoading ? 'Loading...' : 'Sign Up'}
        onClick={handleSubmit(onSubmit)}
        outline
        disabled={isLoading || Object.keys(errors).length > 0}
      />

      <div className="text-sm mt-2">
        Already have an account?{' '}
        <Link href="/login" className="underline text-blue-600">
          Login
        </Link>
      </div>

      <Button
        label={isLoading ? 'Loading...' : 'Sign Up with Google'}
        icon={AiOutlineGoogle}
        iconColor="green"
        onClick={handleGoogleLogin}
        disabled={isLoading}
      />
    </div>
  )
}

export default Register
