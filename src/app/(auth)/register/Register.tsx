'use client'

import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler, FieldValues } from 'react-hook-form'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { AiOutlineGoogle } from 'react-icons/ai'

import Input from '@/components/input/Input'
import Button from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'

import type { SafeUser } from '@/type/SafeUser'

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
      if(error instanceof Error) {
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
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Button
        label={isLoading ? 'Loading...' : 'Sign Up'}
        onClick={handleSubmit(onSubmit)}
        outline
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
      />
    </div>
  )
}

export default Register
