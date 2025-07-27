import { getCurrentUser } from "@/action/CurrentUser"
import Home from "@/components/Home"
export const dynamic = 'force-dynamic'
const page = async() => {
let currentUser = await getCurrentUser()
if (!currentUser) {
    currentUser = { _id: '' } 
  }
  return (
    <div>
      <Home currentUser={currentUser._id }/>
    </div>
  )
}

export default page
