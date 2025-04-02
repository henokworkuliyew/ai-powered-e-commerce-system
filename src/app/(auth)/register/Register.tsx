'use client'
import Input from '@/components/input/Input'
import Button from '@/components/UI/Button'
<<<<<<< HEAD
import Heading from '@/components/ui/Heading'
=======
import Heading from '@/components/UI/Heading'
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import { AiOutlineGoogle } from 'react-icons/ai'
import axios from 'axios'
import toast from 'react-hot-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { SafeUser } from '@/type/SafeUser'

interface RegisterProps {
<<<<<<< HEAD
  currentUser: SafeUser | null
}
const Register: React.FC<RegisterProps> = ({ currentUser }) => {
=======
  currentUser: SafeUser | null  
}
const Register:React.FC<RegisterProps> = ({currentUser}) => {
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
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
<<<<<<< HEAD
=======
     
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
    },
  })

  useEffect(() => {
<<<<<<< HEAD
    if (currentUser) {
=======
    if (currentUser) {  
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
      router.push('/cart')
      router.refresh()
      console.log('User is already logged in')
    }
<<<<<<< HEAD
  }, [])
=======
  }
  , [])
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
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
<<<<<<< HEAD
          redirect: false,
=======
          redirect: false, 
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
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
<<<<<<< HEAD
      .catch((error) => toast.error('Something went wrong!', error))
=======
      .catch((error) => toast.error('Something went wrong!',error))
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
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

export default Register
