
import WrapForm from '@/components/ui/WrapForm'

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


export default page
