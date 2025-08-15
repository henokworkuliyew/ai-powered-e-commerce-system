import { getCurrentUser } from "@/action/CurrentUser"
import Home from "@/components/Home"
import ErrorBoundary from "@/components/ErrorBoundary"

export const dynamic = 'force-dynamic'

const page = async() => {
  let currentUser = await getCurrentUser()
  if (!currentUser) {
    currentUser = { _id: '' } 
  }
  
  return (
    <ErrorBoundary>
      <div>
        <Home currentUser={currentUser._id} />
      </div>
    </ErrorBoundary>
  )
}

export default page
