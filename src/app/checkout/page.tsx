//import WrapForm from '@/components/ui/WrapForm'
import { Toaster } from '@/components/ui/toaster'
import Checkout from './Checkout'

const CheckoutPage = () => {
  return (
    <div className="p-8 bg-slate-100">
         <Toaster/>
        <Checkout />
      
    </div>
  )
}

export default CheckoutPage
