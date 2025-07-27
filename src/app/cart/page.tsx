
import { getCurrentUser } from "@/action/CurrentUser"
import Cart from "./CartPage"
export const dynamic = 'force-dynamic'
const  CartPage =  async () => {
  const currentUser = await getCurrentUser()
  return (
    <div>
    <Cart currentUser={currentUser}/>
    </div>
  )
}

export default CartPage
