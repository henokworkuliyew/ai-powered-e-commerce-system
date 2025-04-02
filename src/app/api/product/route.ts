import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import { Product } from '@/server/models/Product'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()
  if(!currentUser || currentUser.role !== 'MANAGER')
    return NextResponse.error()

  await dbConnect()
  const body = await req.json()

  const { 
  name,
  description,
  category,
  brand,
  image,
  inStock,
  quantity,
  price,
  review, 
 } = body

  console.log('The data is:', body)
   
  try {
    const product = new Product({
      name,
      description,
      category,
      brand,
      image,
      inStock,
      quantity,
      price,
      review,
    })
    const savedUser = await product.save()
    console.log('User created:', savedUser)

    return new Response(
      JSON.stringify({ message: 'Product created', product: savedUser }),
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating product:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}
