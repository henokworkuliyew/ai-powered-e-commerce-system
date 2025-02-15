import React from "react";
import { Product } from "@/type/Product";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
const router = useRouter()

return (

  <div
    className="col-span-1 cursor-pointer  rounded-sm p-2 transition hover:scale-110 text-center text-sm"
    onClick={() => router.push(`/product/${product.id}`)}
  >
product page
  </div>
)

}