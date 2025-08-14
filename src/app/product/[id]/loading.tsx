export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">Loading product...</h2>
        <p className="text-gray-500 mt-2">Please wait while we fetch the product details.</p>
      </div>
    </div>
  )
}


