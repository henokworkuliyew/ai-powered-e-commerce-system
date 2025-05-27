import { getCurrentUser } from "@/action/CurrentUser"
import Home from "@/components/Home"

const page = async() => {
let currentUser = await getCurrentUser()
if (!currentUser) {
    currentUser = { _id: '' } 
  }
  console.log('currentUser1', currentUser._id)
  return (
    <div>
      <Home currentUser={currentUser._id }/>
    </div>
  )
}

export default page
