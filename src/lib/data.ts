 const products = [
  {
    id: '1',
    name: 'Wireless Bluetooth Earbuds',
    description:
      'High-quality wireless earbuds with noise cancellation and 12-hour battery life.',
    price: 49.99,
    brand: 'SoundPro',
    category: 'Electronics',
    inStock: 'In Stock',
    rating: 4,
    images: [
      {
        color: 'Black',
        colorCode: '#000000',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      },
      {
        color: 'White',
        colorCode: '#FFFFFF',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      },
    ],
    reviews: [],
  },
  {
    id: '2',
    name: 'Smartwatch Fitness Tracker',
    description:
      'Track your heart rate, steps, and sleep with this advanced smartwatch.',
    price: 89.99,
    brand: 'FitTech',
    category: 'Wearables',
    inStock: 45,
    rating: 4,
    images: [
      {
        color: 'Midnight Blue',
        colorCode: '#191970',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30',
      },
    ],
    reviews: [],
  },
  {
    id: '3',
    name: '4K Ultra HD Smart TV',
    description:
      '55-inch 4K Ultra HD Smart TV with HDR and built-in streaming apps.',
    price: 499.99,
    brand: 'VisionPlus',
    category: 'Home Entertainment',
    inStock: 'Out of Stock',
    rating: 4,
    images: [
      {
        color: 'Silver',
        colorCode: '#C0C0C0',
        image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image: 'https://images.unsplash.com/photo-1461151304267-38535e780c79',
      },
    ],
    reviews: [],
  },
  {
    id: '5',
    name: 'Noise-Cancelling Headphones',
    description:
      'Premium over-ear headphones with active noise cancellation and 30-hour battery life.',
    price: 199.99,
    brand: 'AudioMaster',
    category: 'Audio',
    inStock: 'In Stock',
    rating: 4,
    images: [
      {
        color: 'Space Gray',
        colorCode: '#A9A9A9',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
      },
    ],
    reviews: [],
  },
  {
    id: '67c1a0ba99e4635f721a8ccb',
    name: 'Portable Bluetooth Speaker',
    description:
      'Waterproof Bluetooth speaker with 20-hour playtime and deep bass.',
    price: 599.9,
    brand: 'BassBoom',
    category: 'Audio',
    inStock: 'Low Stock',
    rating: 4,
    images: [
      {
        color: 'Red',
        colorCode: '#FF0000',
        image:
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
      },
      {
        color: 'Blue',
        colorCode: '#0000FF',
        image:
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image:
          'https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg',
      },
    ],
    reviews: [],
  },
  {
    id: '65d3f2c57f3a2b0012c8a6e5',
    name: 'Smart Home Security Camera',
    description:
      '1080p HD security camera with motion detection and night vision.',
    price: 129.99,
    brand: 'SafeHome',
    category: 'Smart Home',
    inStock: true,
    rating: 3,
    images: [
      {
        color: 'White',
        colorCode: '#FFFFFF',
        image: '/product-image/security-camera.png',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image: '/product-image/security-camera.png',
      },
    ],
    reviews: [],
  },
  {
    id: '9',
    name: 'Electric Standing Desk',
    description:
      'Adjustable height electric standing desk for home or office use.',
    price: 299.99,
    brand: 'ErgoWorks',
    category: 'Furniture',
    inStock: true,
    rating: 3,
    images: [
      {
        color: 'Walnut',
        colorCode: '#5D3A1A',
        image:
          'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image:
          'https://images.pexels.com/photos/4352247/pexels-photo-4352247.jpeg',
      },
    ],
    reviews: [],
  },
  {
    id: '10',
    name: 'Wireless Charging Pad',
    description:
      'Fast wireless charging pad compatible with all Qi-enabled devices.',
    price: 29.99,
    brand: 'ChargeIt',
    category: 'Accessories',
    inStock: true,
    rating: 3,
    images: [
      {
        color: 'Black',
        colorCode: '#000000',
        image:
          'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
      },
      {
        color: 'White',
        colorCode: '#FFFFFF',
        image:
          'https://images.pexels.com/photos/341523/pexels-photo-341523.jpeg',
      },
    ],
    reviews: [],
  },
  {
    id: '12',
    name: 'Gaming Mouse',
    description: 'High-precision gaming mouse with customizable RGB lighting.',
    price: 49.99,
    brand: 'GameGear',
    category: 'Accessories',
    inStock: true,
    rating: 5,
    images: [
      {
        color: 'Black',
        colorCode: '#000000',
        image:
          'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
      },
      {
        color: 'Red',
        colorCode: '#FF0000',
        image:
          'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
      },
    ],
    reviews: [],
  },
  {
    id: '13',
    name: 'External SSD',
    description:
      '1TB external SSD with fast data transfer speeds and compact design.',
    price: 99.99,
    brand: 'FastDrive',
    category: 'Storage',
    inStock: true,
    rating: 3,
    images: [
      {
        color: 'Silver',
        colorCode: '#C0C0C0',
        image:
          'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      },
      {
        color: 'Black',
        colorCode: '#000000',
        image:
          'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg',
      },
    ],
    reviews: [],
  },
]

export default products
