'use client'
import Input from '@/components/input/Input'
import Button from '@/components/UI/Button'
import Heading from '@/components/UI/Heading'
import Link from 'next/link'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineGoogle } from 'react-icons/ai'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
const Register = () => {
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

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    console.log('Submitting data:', data)
    setIsLoading(true)

    axios
      .post('/api/register', data)
      .then(() => {
        toast.success('register sucessfully!')
        signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false, 
        }).then((callback) => {
          if (callback?.ok) {
            router.push('/cart')
            router.refresh()
            toast.success('Successfully logged in')
          }
          if (callback?.error) {
            toast.error('Invalid email or password to login')
          }
        })
      })
      .catch((error) => toast.error('Something went wrong!',error))
      .finally(() => setIsLoading(false))
  }

  return (
    <div>
      <Heading text={'SignUp'} level={3} gradient />
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
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        type="password"
      />
      {/* <Input
        id="phone"
        label="Phone"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      /> */}

      <div className="mt-5 mb-5">
        <Button
          label={isLoading ? 'Loading' : 'Sign Up'}
          onClick={handleSubmit(onSubmit)}
          outline
        />
        <span className="text-sm mt-3 flex flex-row gap-2">
          Already have an account?{' '}
          <Link className="underline" href="/login">
            <Heading text="Login" level={6} gradient />
          </Link>
        </span>
      </div>

      <Button
        label={isLoading ? 'Loading' : 'Sign Up with Google'}
        icon={AiOutlineGoogle}
        iconColor="green"
        onClick={() => {}}
      />
    </div>
  )
}

export default Register
