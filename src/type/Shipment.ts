export interface Shipment {
  id: string
  trackingNumber: string
  customer: string
  carrier: string
  dateShipped?: string
  dateDelivered?: string
  items: number
  status: string
}
