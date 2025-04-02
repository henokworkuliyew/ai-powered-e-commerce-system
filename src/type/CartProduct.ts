export type CartProduct = {
  id: string
  name: string
  description: string
  brand: string
  category: string
  selectedImg: SelectedImg
  qty: number
  price: number
}
export type SelectedImg = {
  color: string
  colorCode: string
  image: string
}