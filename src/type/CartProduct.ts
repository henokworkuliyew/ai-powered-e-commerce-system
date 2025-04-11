export type CartProduct = {
  _id?: string
  id: string
  name: string
  description: string
  brand: string
  category: {
    name: string
    subCategories: string[]
  }
  selectedImg: SelectedImg
  qty: number
  price: number
}
export type SelectedImg = {
  color: string
  colorCode: string
  views: {
    front: string
    side: string
    back: string
  }
}