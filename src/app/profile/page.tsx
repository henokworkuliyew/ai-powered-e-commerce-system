import { getCurrentUser } from "@/action/CurrentUser"
import ProfilePage from "./Profile"


const page = async () => {
    const currentUser = await getCurrentUser()
  return (
    <div>
      <ProfilePage currentUser={currentUser} />
    </div>
  )
}

export default page
