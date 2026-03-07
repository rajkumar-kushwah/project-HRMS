import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"

const Dashboard = () => {


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
    <h1>Dashboard</h1>
    </SidebarProvider>
  )
}

export default Dashboard