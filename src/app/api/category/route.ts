import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Category from '@/server/models/Category'

export async function GET(request: Request) {
  try {
    await dbConnect()
    const categories = await Category.find({}).sort({ name: 1 })
    return NextResponse.json(
      { categories },
      {
        headers: {
          'Access-Control-Allow-Origin': '*', 
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    }
  )
}
