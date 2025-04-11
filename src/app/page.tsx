import { ProductCard } from "@/components/ProductCard/productCard"
// import products from "@/lib/data"
import { Product } from "@/type/Product"



export default async function Home() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/product`, {
    cache: 'no-store', 
  })

  if (!res.ok) {
    
    return <div className="text-red-500">Failed to load products.</div>
  }
  
  const data = await res.json()
  
  const products: Product[] = data.products || []

  return (
    <div className="grid grid-cols-2 gap-8 w-full  sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products?.map((product, index: number) => {

        return <ProductCard key={index} product = {product} />

      })}
    </div>
  )
}
