'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import products from '@/lib/data'
import ProductDetail from '../ProductDetail'

const Page = () => {
  const params = useParams()
  console.log('Params:', params) 

  if (!params || !params.id) {
    console.error('Invalid Product ID')
    return <div>Invalid Product</div>
  }

  const product = products.find((x) => x.id.toString() === params.id)

  if (!product) {
    console.error('Product Not Found')
    return <div>Product not found</div>
  }

  return (
    <div className="grid grid-cols-1 gap-11">
      <ProductDetail product={product} />
    </div>
  )
}

export default Page
