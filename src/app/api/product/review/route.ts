import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { Review } from '@/server/models/Review'
import { Product } from '@/server/models/Product'
import  Order  from '@/server/models/Order' 
import { getCurrentUser } from '@/action/CurrentUser'

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const reviews = await Review.find({
      productId,
    })
      .populate('userId', 'name image')
      .sort({ createdAt: -1 })
      .lean()

    const totalReviews = reviews.length
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    }

    reviews.forEach((review) => {
      ratingDistribution[review.rating as keyof typeof ratingDistribution]++
    })

    return NextResponse.json({
      reviews,
      stats: {
        totalReviews,
        averageRating,
        ratingDistribution,
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect()

    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json(
        { error: 'You must be logged in to submit a review' },
        { status: 401 }
      )
    }

    const data = await request.json()

    if (!data.productId || !data.rating || !data.comment) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const existingReview = await Review.findOne({
      userId: currentUser._id,
      productId: data.productId,
    })

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 400 }
      )
    }

    
    const hasVerifiedPurchase = await Order.exists({
      userId: currentUser._id,
      orderStatus: 'delivered',
      'items.productId': data.productId,
    })

    
    const review = new Review({
      userId: currentUser._id,
      productId: data.productId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      images: data.images || [],
      status: 'pending',
      verified: !!hasVerifiedPurchase, 
    })

    await review.save()

    const productReviews = await Review.find({
      productId: data.productId,
      status: 'published',
    }).lean()

    const totalReviews = productReviews.length
    const totalRating = productReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    )
    const averageRating = totalReviews > 0 ? totalRating / totalReviews : 0

   
    await Product.findByIdAndUpdate(
      data.productId,
      { rating: averageRating },
      { new: true }
    )

    return NextResponse.json({
      message: 'Review submitted successfully and is pending approval',
      reviewId: review._id,
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to submit review' },
      { status: 500 }
    )
  }
}
