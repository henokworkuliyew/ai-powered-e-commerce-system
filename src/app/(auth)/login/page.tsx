import React from 'react'
import Login from './Login'
<<<<<<< HEAD
import WrapForm from '@/components/ui/WrapForm'
=======
import WrapForm from '@/components/UI/WrapForm'
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
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
