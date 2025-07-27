import { getCurrentUser } from '@/action/CurrentUser';
import dbConnect from '@/lib/dbConnect';
import Category from '@/server/models/Category';
import { Product } from '@/server/models/Product';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'MANAGER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await dbConnect();
  const body = await req.json();
  const { name, description, category, brand, images, inStock, quantity, price } = body;
  return new Response(
    JSON.stringify({ message: 'Product created', product:Product }),
    { status: 201, headers: { 'Access-Control-Allow-Origin': '*' } }
  );
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    const products = await Product.find().populate('category');
    console.log('Fetched products:', products);
    return NextResponse.json({ products }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}