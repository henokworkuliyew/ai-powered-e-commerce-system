export interface Order {
  _id: string
  user: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'cancelled'
  deliveryStatus:
    | 'pending'
    | 'shipped'
    | 'in transit'
    | 'delivered'
    | 'returned'
  createDate: string
  paymentIntentId: string
  products: OrderProduct[]
  address: OrderAddress
}

export interface OrderProduct {
  name: string
  description: string
  category: string
  brand: string
  selectedImg: {
    color: string
    colorCode: string
    image: string
  }
  quantity: number
  price: number
}

export interface OrderAddress {
  name: string
  email: string
  phone: string
  street: string
  city: string
  country: string
  zipCode: string
}

export interface CartProduct {
  _id?: string
  id: string
  name: string
  description: string
  brand: string
  category: string
  selectedImg: SelectedImg
  qty: number
  price: number
}

export interface SelectedImg {
  color: string
  colorCode: string
  views: {
    front: string
    side: string
    back: string
  }
}
