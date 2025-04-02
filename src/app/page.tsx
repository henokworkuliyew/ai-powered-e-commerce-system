import { ProductCard } from "@/components/ProductCard/productCard"
<<<<<<< HEAD
import  products  from "@/lib/data"
=======
import { products } from "@/lib/data"
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f

export default function Home() {
  return (
    <div className="grid grid-cols-2 gap-8 w-full  sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {products?.map((product, index: number) => {
<<<<<<< HEAD
        return <ProductCard key={index} product = {product} />
=======
        return <ProductCard key={index} product={product} />
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
      })}
    </div>
  )
}
