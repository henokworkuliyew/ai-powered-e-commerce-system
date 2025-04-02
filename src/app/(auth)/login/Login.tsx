'use client'
import Input from '@/components/input/Input'
<<<<<<< HEAD
import  Button  from '@/components/ui/Button'
import Heading from '@/components/ui/Heading'
=======
import Button from '@/components/UI/Button'
import Heading from '@/components/UI/Heading'
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
import { SafeUser } from '@/type/SafeUser'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { AiOutlineGoogle } from 'react-icons/ai'
<<<<<<< HEAD

interface LoginProps {
  currentUser: SafeUser | null
}
const Login: React.FC<LoginProps> = ({ currentUser }) => {
=======
 
interface LoginProps {
  currentUser: SafeUser | null
}
const Login:React.FC<LoginProps> = ({currentUser}) => {
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
  const router = useRouter()
  const [isLoading, setIsLoadig] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
<<<<<<< HEAD
      email: '',
      password: '',
=======
          email: '',
      password: '',
      
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
    },
  })
  useEffect(() => {
    if (currentUser) {
      router.push('/cart')
      router.refresh()
      console.log('User is already logged in')
    }
  }, [currentUser])
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoadig(true)
    signIn('credentials', {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoadig(false)
      if (callback?.ok) {
        router.push('/')
        router.refresh()
        toast.success('Login successful')
      }
<<<<<<< HEAD

=======
        
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
      if (callback?.error) {
        console.error(callback.error)
      }
    })
  }
  return (
    <div>
      <Heading text={'SignIn'} level={3} gradient />

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

      <div className="mt-5 mb-5">
        <Button
          label={isLoading ? 'Loading' : 'Login'}
          onClick={handleSubmit(onSubmit)}
          outline
        />
        <span className="text-sm mt-3 flex flex-row gap-2">
          Do not have an account?{' '}
          <Link className="underline" href="/register">
            <Heading text="SignUp" level={6} gradient />
          </Link>
        </span>
      </div>
      <Button
<<<<<<< HEAD
        label={isLoading ? 'Loading' : 'SignIn with Google'}
=======
        label={isLoading ? 'Loading' : 'Sign Up with Google'}
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
        icon={AiOutlineGoogle}
        iconColor="green"
        onClick={() => {
          signIn('google', { redirect: false }).then((callback) => {
            console.log('Google SignIn Callback:', callback)
            if (callback?.ok) {
              router.push('/cart')
              router.refresh()
            }
            if (callback?.error) {
              toast.error('Google authentication failed!')
            }
          })
        }}
      />
    </div>
  )
}

export default Login
