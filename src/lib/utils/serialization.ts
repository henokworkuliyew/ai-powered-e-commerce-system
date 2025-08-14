import type { Product } from '@/type/Product'

/**
 * Serializes a Mongoose document to a plain object for client components
 * This prevents the "Only plain objects can be passed to Client Components" error
 */
export function serializeProduct(productData: any): Product {
  return {
    _id: productData._id?.toString() || '',
    name: productData.name || '',
    description: productData.description || '',
    category: {
      name: productData.category?.name || '',
      subCategories: productData.category?.subCategories || [],
    },
    brand: productData.brand || '',
    images: serializeImages(productData.images || []),
    inStock: productData.inStock || false,
    quantity: productData.quantity || 0,
    price: productData.price || 0,
    rating: productData.rating || 0,
  }
}

/**
 * Serializes the images array to handle nested ObjectId fields
 */
function serializeImages(images: any[]): any[] {
  if (!Array.isArray(images)) return []
  
  return images.map(image => ({
    color: image.color || '',
    colorCode: image.colorCode || '',
    views: {
      front: image.views?.front || '',
      side: image.views?.side || '',
      back: image.views?.back || '',
    }
  }))
}

/**
 * Serializes an array of products
 */
export function serializeProducts(productsData: any[]): Product[] {
  return productsData.map(serializeProduct)
}

/**
 * Serializes any Mongoose document to a plain object
 */
export function serializeDocument(doc: any): any {
  if (!doc) return null
  
  // Handle arrays
  if (Array.isArray(doc)) {
    return doc.map(serializeDocument)
  }
  
  // Handle objects
  if (typeof doc === 'object') {
    const serialized: any = {}
    
    for (const [key, value] of Object.entries(doc)) {
      // Skip Mongoose-specific properties
      if (key.startsWith('$') || key === '__v') continue
      
      if (value && typeof value === 'object') {
        // Handle ObjectId
        if (value.toString && typeof value.toString === 'function' && key === '_id') {
          serialized[key] = value.toString()
        }
        // Handle Date objects
        else if (value instanceof Date) {
          serialized[key] = value.toISOString()
        }
        // Recursively serialize nested objects
        else {
          serialized[key] = serializeDocument(value)
        }
      } else {
        serialized[key] = value
      }
    }
    
    return serialized
  }
  
  return doc
}
