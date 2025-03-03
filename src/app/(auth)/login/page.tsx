import React from 'react'
import Login from './Login'
import WrapForm from '@/components/UI/WrapForm'
import { getCurrentUser } from '@/action/CurrentUser'

const page = async () => {
  const currentUser = await getCurrentUser()
  return (
    <WrapForm>
      <Login currentUser={currentUser} />
    </WrapForm>
  )
}

export default page
