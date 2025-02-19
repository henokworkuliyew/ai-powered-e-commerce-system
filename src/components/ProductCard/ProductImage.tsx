'use client'
import { CartProduct, SelectedImg } from "@/type/CartProduct"
import { Product } from "@/type/Product"
import Image from "next/image"
interface ProductImageProps {
  cartProduct: CartProduct
  product: Product
  handleColorSelect: (value: SelectedImg) => void
}

const ProductImage: React.FC<ProductImageProps> = ({
  cartProduct,
  product,
  handleColorSelect,
}) => {
 const images: SelectedImg[] = product.images || []

// const productRating =
//   product.reviews.reduce((acc: number, item: any) => item.rating + acc, 0) /
//   product.reviews.length
 return (
   <div
     className="
        grid grid-cols-6
        gap-2
        h-full
        max-h-[500px]
        min-h-[300px]
        sm:min-h-[400px]"
   >
     <div
       className="
          flex flex-col
          items-center
          justify-center
          gap-4
          cursor-pointer
          border 
          h-full
          max-h-[500px]
          min-h-[300px]
          sm:min-h-[400px]"
     >
       {images.map((image) => (
         <div
           key={image.color}
           onClick={() => handleColorSelect(image)}
           className={`relative w-[80%] aspect-square rounded border-teal-300 ${
             cartProduct.selectedImg.color === image.color
               ? 'border-[1.5px]'
               : 'border-none'
           }`}
         >
           <Image
             src={image.image}
             alt={image.color}
             fill
             className="object-contain"
           />
         </div>
       ))}
     </div>
     <div className="col-span-5 relative aspect-square">
       <Image
         src={cartProduct.selectedImg.image}
         alt={cartProduct.name}
         fill
         className="object-contain
            h-full
            max-h-[500px]
          min-h-[300px]
          sm:min-h-[400px]
            "
       />
     </div>
   </div>
 )
}

export default ProductImage