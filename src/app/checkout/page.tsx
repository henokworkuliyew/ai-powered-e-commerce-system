import WrapForm from '@/components/ui/WrapForm'
import React from 'react'
import Checkout from './Checkout'

const page = () => {
  return (
    <div className="p-8">
      <WrapForm>
        <Checkout />
      </WrapForm>
    </div>
  )
}

export default page
