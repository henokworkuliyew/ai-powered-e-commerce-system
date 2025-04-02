<<<<<<< HEAD
import { getCurrentUser } from "@/action/CurrentUser"
import Cart from "./CartPage"

const  CartPage =  async () => {
  const currentUser = await getCurrentUser()
  return (
    <div>
    <Cart currentUser={currentUser}/>
=======
import Cart from "./CartPage"

const CartPage = () => {
  return (
    <div>
    <Cart/>
>>>>>>> 0bf8cd0d973f32e2f804b37a161a531be8b1356f
    </div>
  )
}

export default CartPage
