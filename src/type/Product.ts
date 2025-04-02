export type Product = {
  id: string
  name: string
  description: string
  price: number
  brand: string
  category: string
  inStock: boolean
  rating:number
  images: {
    color: string
    colorCode: string
    image: string
  }[]
  reviews: string[] 
}
