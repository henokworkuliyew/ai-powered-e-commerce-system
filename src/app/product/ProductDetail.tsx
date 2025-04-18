'use client'
import { useCallback,  useState } from 'react'
import type React from 'react'

import { MdCheckCircle, MdSecurity, MdLoop } from 'react-icons/md'
import { FaTruck, FaQuestion } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Product } from '@/type/Product'
import type { CartProduct, SelectedImg } from '@/type/CartProduct'
import { useCart } from '@/hooks/useCart'
import RecentlyViewed from '@/components/ProductCard/RecentlyViewed'
import ProductGallery from './product-gallery'
import ProductInfo from './product-info'
import Button from '@/components/ui/Button'
import ReviewList from '@/components/review/ReviewList'
import ReviewForm from '@/components/review/ReveiwForm'
import { mockQuestions, mockReviews } from '@/lib/mockData'

interface ProductDetailsProps {
  product: Product
}

const ProductDetail: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter()
  const [cartProduct, setCartProduct] = useState<CartProduct>({
    id: product.id ,
    _id: product._id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category.name,
    selectedImg: {
      ...product.images[0],
    },
    qty: 1,
    price: product.price,

    selectedSize: 'M',
  })

  const handleColorSelect = useCallback(
    (value: SelectedImg) => {
      setCartProduct((prev: CartProduct) => ({ ...prev, selectedImg: value }))
    },
    [cartProduct.selectedImg]
  )

  const { handleAddProductToCart } = useCart()
  const [activeTab, setActiveTab] = useState<
    'description' | 'reviews' | 'questions' | 'shipping'
  >('description')
  const [selectedSize, setSelectedSize] = useState('M')

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.qty === 50) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty + 1,
      }
    })
  }, [cartProduct])

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.qty === 1) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty - 1,
      }
    })
  }, [cartProduct])

 

  const handleAddToCart = (): void => {
    handleAddProductToCart(cartProduct)
    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: <MdCheckCircle className="text-green-500" />,
    })
  }

  const handleBuyNow = (): void => {
   // handleAddProductToCart(cartProduct)
    router.push('/checkout')
  }

  return (
    <div className="flex flex-col mr-5">
      <div className="grid grid-cols-1 md:grid-cols-2 md:w-full gap-10">
        <ProductGallery
          product={product}
          cartProduct={cartProduct}
          handleColorSelect={handleColorSelect}
        />

        <ProductInfo
          product={product}
          cartProduct={cartProduct}
          handleQtyIncrease={handleQtyIncrease}
          handleQtyDecrease={handleQtyDecrease}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          setCartProduct={setCartProduct}
          mockReviews={mockReviews}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
       
      </div>

     
      <div id="product-tabs" className="mt-10">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'description'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Product Details
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({mockReviews.length})
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'questions'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('questions')}
            >
              Q&A ({mockQuestions.length})
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">
                Product Description
              </h3>
              <p className="mb-4">{product.description}</p>

              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Premium quality materials for durability</li>
                    <li>Ergonomic design for maximum comfort</li>
                    <li>Versatile style suitable for various occasions</li>
                    <li>Easy to maintain and clean</li>
                    <li>Eco-friendly manufacturing process</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Material</span>
                      <span>Premium Cotton</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Weight</span>
                      <span>0.5 kg</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Dimensions</span>
                      <span>30 x 20 x 10 cm</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Warranty</span>
                      <span>1 Year</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Country of Origin</span>
                      <span>United States</span>
                    </div>
                  </div>
                </div>
              </div>

             
              <div className="mt-8">
                <h4 className="font-medium mb-3">Care Instructions</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Machine wash cold with similar colors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Do not bleach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Tumble dry low</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Cool iron if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Do not dry clean</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <ReviewList reviews={mockReviews} productId={product._id ||''} />
              <div className="mt-8">
                <ReviewForm productId={product._id || ''} />
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Customer Questions
                </h3>

                {mockQuestions.map((q) => (
                  <div key={q.id} className="border-b pb-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FaQuestion className="text-teal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Asked by {q.askedBy} •{' '}
                          {new Date(q.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-3 ml-6">
                      <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p>{q.answer}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Answered by {q.answeredBy}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Ask a Question</h4>
                <form className="space-y-4">
                  <div>
                    <label
                      htmlFor="question"
                      className="block text-sm font-medium mb-1"
                    >
                      Your Question
                    </label>
                    <textarea
                      id="question"
                      rows={3}
                      className="w-full px-3 py-2 border rounded-md"
                      placeholder="What would you like to know about this product?"
                    ></textarea>
                  </div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Your name"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                  </div>
                  <Button label="Submit Question" outline />
                </form>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Shipping Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Standard Shipping</h4>
                        <p className="text-sm text-gray-600">
                          Delivery in 2-4 business days
                        </p>
                        <p className="text-sm font-medium">$4.99</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Express Shipping</h4>
                        <p className="text-sm text-gray-600">
                          Delivery in 1-2 business days
                        </p>
                        <p className="text-sm font-medium">$9.99</p>
                      </div>
                    </div>

                    <div className="pt-2 text-sm text-gray-600 border-t">
                      <p>Free standard shipping on orders over $50.</p>
                      <p>
                        We ship to all 50 US states and select international
                        destinations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MdLoop className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">30-Day Returns</h4>
                        <p className="text-sm text-gray-600">
                          We offer a 30-day return policy for most items.
                        </p>
                        <p className="text-sm text-gray-600">
                          Items must be in original condition with tags
                          attached.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MdSecurity className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Warranty</h4>
                        <p className="text-sm text-gray-600">
                          All products come with a 1-year manufacturer warranty.
                        </p>
                        <p className="text-sm text-gray-600">
                          Covers defects in materials and workmanship.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-sm text-gray-600 border-t">
                      <p>
                        Please contact our customer service team for any
                        questions about returns or warranty claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      
      <RecentlyViewed currentProductId={product._id || ''} />
    </div>
  )
}

export default ProductDetail
