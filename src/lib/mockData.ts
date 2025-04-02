// Mock data for shipments
export const shipmentData = [
  {
    id: 'SHP001',
    trackingNumber: 'TRK12345678',
    customer: 'John Doe',
    status: 'Delivered',
    carrier: 'FedEx',
    dateShipped: '2023-03-15',
    dateDelivered: '2023-03-18',
    items: 3,
  },
  {
    id: 'SHP002',
    trackingNumber: 'TRK23456789',
    customer: 'Jane Smith',
    status: 'In Transit',
    carrier: 'UPS',
    dateShipped: '2023-03-16',
    dateDelivered: null,
    items: 2,
  },
  {
    id: 'SHP003',
    trackingNumber: 'TRK34567890',
    customer: 'Robert Johnson',
    status: 'Processing',
    carrier: 'USPS',
    dateShipped: null,
    dateDelivered: null,
    items: 5,
  },
  {
    id: 'SHP004',
    trackingNumber: 'TRK45678901',
    customer: 'Emily Wilson',
    status: 'Delivered',
    carrier: 'DHL',
    dateShipped: '2023-03-12',
    dateDelivered: '2023-03-15',
    items: 1,
  },
  {
    id: 'SHP005',
    trackingNumber: 'TRK56789012',
    customer: 'Michael Brown',
    status: 'In Transit',
    carrier: 'FedEx',
    dateShipped: '2023-03-17',
    dateDelivered: null,
    items: 4,
  },
]

// Mock data for shipment items
export const shipmentItemsData = {
  SHP001: [
    { id: 'ITEM001', name: 'Premium Headphones', quantity: 1, sku: 'HDX-100' },
    { id: 'ITEM002', name: 'Wireless Keyboard', quantity: 1, sku: 'KBD-200' },
    { id: 'ITEM003', name: 'Ergonomic Mouse', quantity: 1, sku: 'MOU-300' },
  ],
  SHP002: [
    { id: 'ITEM004', name: '4K Monitor', quantity: 1, sku: 'MON-400' },
    { id: 'ITEM005', name: 'Bluetooth Speaker', quantity: 1, sku: 'SPK-500' },
  ],
  SHP003: [
    { id: 'ITEM006', name: 'USB-C Hub', quantity: 2, sku: 'HUB-700' },
    { id: 'ITEM007', name: 'Wireless Charger', quantity: 3, sku: 'CHG-800' },
  ],
  SHP004: [
    { id: 'ITEM008', name: 'Premium Headphones', quantity: 1, sku: 'HDX-100' },
  ],
  SHP005: [
    { id: 'ITEM009', name: 'Wireless Keyboard', quantity: 2, sku: 'KBD-200' },
    { id: 'ITEM010', name: 'Ergonomic Mouse', quantity: 2, sku: 'MOU-300' },
  ],
}

export const orders = [
  {
    id: '#1001',
    customer: 'John Doe',
    date: '2024-03-12',
    items: ['Laptop', 'Mouse'],
    total: 1200.99,
    status: 'Pending',
  },
  {
    id: '#1002',
    customer: 'Jane Smith',
    date: '2024-03-11',
    items: ['Phone', 'Charger'],
    total: 850.5,
    status: 'Completed',
  },
  {
    id: '#1003',
    customer: 'Alice Johnson',
    date: '2024-03-10',
    items: ['Headphones'],
    total: 199.99,
    status: 'Shipped',
  },
]

