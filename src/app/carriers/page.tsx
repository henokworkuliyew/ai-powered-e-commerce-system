// import { getCurrentUser } from "@/action/CurrentUser"
// import UnauthorizedPage from "@/components/unauthorized"
import CarrierProfilePage from "./Carrier"



const page = async () => {
  
  // const currentUser = await getCurrentUser()

  // if (!currentUser || !currentUser.role.includes('MANAGER')) {
  //   return <UnauthorizedPage/>
  // }
  return (
    <div>
      <CarrierProfilePage  />
    </div>
  )
}

export default page
