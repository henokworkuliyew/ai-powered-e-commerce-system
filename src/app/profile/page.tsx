import { getCurrentUser } from "@/action/CurrentUser"
import ProfilePage from "./Profile"
export const dynamic = 'force-dynamic'

const page = async () => {
    const currentUser = await getCurrentUser()
  return (
    <div>
      <ProfilePage currentUser={currentUser} />
    </div>
  )
}

export default page
