import { getCurrentUser } from '@/action/CurrentUser'
import { Order } from '@/server/models/Order'
import { CartProduct } from '@/type/CartProduct'
import { NextResponse } from 'next/server'
import mongoose from 'mongoose'

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY as string
const CHAPA_BASE_URL = 'https://api.chapa.co/v1/transaction/initialize'

const calculateOrderAmount = (items: CartProduct[]) => {
  return items.reduce((acc, item) => acc + item.price * item.qty, 0)
}

export async function POST(req: Request) {
  try {
    const currentUser = await getCurrentUser()
   
    if (!currentUser) {
      return NextResponse.json(
        { error: 'You need to be signed in to make a purchase.' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { items, address } = body
    console.log("Order address :",address)
    const total = calculateOrderAmount(items)

    const tx_ref = `tx-${Date.now()}`

    const orderData = {
      user: currentUser._id,
      amount: total,
      currency: 'ETB',
      status: 'pending',
      paymentIntentId: tx_ref,
      products: items.map((item: CartProduct) => ({
        _id: mongoose.Types.ObjectId.isValid(item.id)
          ? new mongoose.Types.ObjectId(item.id)
          : undefined,
        name: item.name,
        description:item.description,
        category: item.category.name,
        brand: item.brand,
        selectedImg: {
          color: item.selectedImg.color,
          colorCode:item.selectedImg.colorCode,
          image: item.selectedImg.views.front,
        },
        quantity: item.qty,
        price: item.price,
      })),
      
     address : {
      name:address.name,
      email:address.email,
      phone: address.phone,
      street: address.street,
      city: address.city,
      country: address.country,
      zipCode: address.city,

     }
    }

    
    const chapaResponse = await fetch(CHAPA_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${CHAPA_SECRET_KEY}`,
      },
      body: JSON.stringify({
        amount: total,
        currency: 'ETB',
        tx_ref,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart`,
        description: 'E-commerce payment',
        email: currentUser.email,
        first_name: currentUser.name,
      }),
    })

    const chapaData = await chapaResponse.json()
     console.log('✅ Chapa Response:', chapaData)
    if (!chapaData.status) {
      
      return NextResponse.json(
        { error: 'Failed to create payment request' },
        { status: 500 }
      )
    }

  
    const newOrder = await Order.create(orderData)
    
    return NextResponse.json({
      
      checkoutUrl: chapaData.data.checkout_url,
      tx_ref,
      order: newOrder,
    })
  } catch (error) {
    console.error('Error in payment process:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
