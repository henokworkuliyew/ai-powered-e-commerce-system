
'use client'


import { useState } from 'react'

interface ReviewFormProps {
  productId: string
}
const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const [rating, setRating] = useState<number>(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, rating, comment }),
    })

    const data = await res.json()
    if (res.ok) {
      alert('Review submitted!')
      setComment('')
    } else {
      alert(data.error || 'Failed to submit review')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-md">
      <div>
        <label>Rating: </label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label>Comment: </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
          className="w-full border p-2"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  )
}

export default ReviewForm