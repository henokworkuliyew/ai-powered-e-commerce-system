'use client'

import React, { useState, useRef } from 'react'
import { Rating } from '@mui/material'
import Button from '@/components/ui/Button'
import { toast } from 'react-toastify'
import { MdCheckCircle, MdClose, MdImage, MdSend } from 'react-icons/md'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
}): JSX.Element => {
  const [rating, setRating] = useState<number | null>(0)
  const [comment, setComment] = useState('')
  const [title, setTitle] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [images, setImages] = useState<string[]>([])
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState({
    rating: false,
    comment: false,
  })

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      rating: !rating || rating === 0,
      comment: !comment.trim(),
    }

    setErrors(newErrors)

    if (newErrors.rating || newErrors.comment) {
      return
    }

    setIsSubmitting(true)

    try {
      // Here you would normally submit the review to your API
      // const formData = new FormData()
      // formData.append('productId', productId)
      // formData.append('rating', rating.toString())
      // formData.append('title', title)
      // formData.append('comment', comment)
      // images.forEach((image, index) => {
      //   formData.append(`image-${index}`, image)
      // })

      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   body: formData
      // })

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast.success('Your review has been submitted!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <MdCheckCircle className="text-green-500" />,
      })

      // Reset form
      setRating(0)
      setComment('')
      setTitle('')
      setImages([])
      setShowForm(false)

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files
    if (!files) return

    // In a real app, you would upload these to your server/cloud storage
    // For now, we'll just create object URLs
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages])

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number): void => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const CustomRatingInput = (): JSX.Element => (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setRating(value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(null)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FaStar
              className={`w-8 h-8 ${
                (
                  hoverRating !== null
                    ? value <= hoverRating
                    : value <= (rating || 0)
                )
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {(rating || hoverRating) && (
        <div className="text-sm font-medium mt-1 text-teal-600">
          {ratingLabels[hoverRating || rating || 0]}
        </div>
      )}
    </div>
  )

  if (!showForm) {
    return (
      <div className="mt-6">
        <Button
          label="Write a Review"
          onClick={() => setShowForm(true)}
          outline
          icon={MdSend}
        />
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <form
          onSubmit={handleSubmit}
          className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Write a Review</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={20} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-center">
              How would you rate this product?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center">
              <CustomRatingInput />
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500 text-center">
                Please select a rating
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-title"
              className="block mb-2 text-sm font-medium"
            >
              Review Title
            </label>
            <input
              type="text"
              id="review-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Summarize your experience (optional)"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block mb-2 text-sm font-medium"
            >
              Your Review <span className="text-red-500">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => {
                setComment(e.target.value)
                if (e.target.value.trim())
                  setErrors({ ...errors, comment: false })
              }}
              rows={4}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="What did you like or dislike about this product? How was your experience using it?"
            ></textarea>
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">Please write a review</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your review helps other shoppers make informed decisions and
              improves our products.
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Add Photos (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded-md overflow-hidden group"
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdClose size={12} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                >
                  <MdImage size={24} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              You can upload up to 5 images. Each image must be less than 5MB.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              label={isSubmitting ? 'Submitting...' : 'Submit Review'}
              disabled={isSubmitting}
              onClick={(e) => handleSubmit(e)}
              outline
              icon={MdSend}
            />
            <Button
              label="Cancel"
              onClick={() => setShowForm(false)}
              outline={false}
            />
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReviewForm
