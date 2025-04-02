'use client'
import React from "react";
import { Product } from "@/type/Product";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { truncateText } from "@/hooks/utils/truncateText";
import { Rating } from '@mui/material'
import { FormatPrice } from "@/hooks/utils/formatPrice";
interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
const router = useRouter()
return (
  <div
    className="col-span-1 cursor-pointer  rounded-sm p-2 transition hover:scale-110 text-center text-sm"
    onClick={() => {
      router.push(`/product/${product.id}`)
    }}
  >
    <div className="flex flex-col items-center w-full gap-1">
      <div className="aspect-square overflow-hidden relative w-full h-36">
        <Image
          src={product?.images?.[0]?.image || '/placeholder.png'}
          alt={product?.name || 'Product Image'}
          fill
         
          className="w-full h-36 object-cover rounded-md"
        />
      </div>
      <div className="mt-5">
        {truncateText(product?.name || 'No Name Available')}
      </div>
      <div>
        <Rating value={product.rating || 3} readOnly />
      </div>
      {/* <div>{product?.reviews.length} reviews</div> */}
      <div className="pb-5">{FormatPrice(product?.price)}</div>
    </div>
  </div>
)

}