<<<<<<< HEAD
import WrapForm from '@/components/ui/WrapForm'
=======
import WrapForm from '@/components/UI/WrapForm'
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
import React from 'react'
import Register from './Register'
import { getCurrentUser } from '@/action/CurrentUser'

const page = async () => {
  const currentUser = await getCurrentUser()
  return (
    <WrapForm>
      <Register currentUser={currentUser} />
    </WrapForm>
  )
}

<<<<<<< HEAD
=======

>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
export default page
