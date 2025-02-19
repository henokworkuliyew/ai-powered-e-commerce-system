'use client'

import { CartProduct } from "@/type/CartProduct"


interface SetQtyProps {
  cartCounter?: boolean
  cartProduct: CartProduct
  handleQtyIncrease: () => void
  handleQtyDecrease: () => void
}
const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter ? null : <div className="font-semibold">Quantity:</div>}
      <div className="flex gap-5 ">
        <button
          onClick={handleQtyDecrease}
          className="border-[1.2px] border-slate-300 px-2 rounded bg-slate-500 hover:bg-slate-600"
        >
          -
        </button>
        <div>{cartProduct.qty}</div>
        <button
          onClick={handleQtyIncrease}
          className="border-[1.2px] border-slate-300 px-2 rounded bg-slate-500 hover:bg-slate-600"
        >
          +
        </button>
      </div>
    </div>
  )
}
export default SetQuantity
