import { ProductCard } from "@/components/ProductCard/productCard"
import { products } from "@/lib/data"

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-8 w-full  sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products?.map((product, index: number) => {
        return <ProductCard key={index} product={product} />
      })}
    </div>
  )
}
