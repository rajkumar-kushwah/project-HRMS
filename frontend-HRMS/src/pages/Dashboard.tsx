import { SidebarContent, SidebarFooter, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import { Card, CardContent, CardDescription, CardAction, CardFooter, CardHeader, CardTitle } from "../components/ui/card"

const Dashboard = () => {


  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        <h1>Dashboard</h1>
        <SidebarContent>
          <SidebarFooter>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-3 p-3">
              <Card className="max-w-md ">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>10</CardDescription>
                  <CardAction className="border rounded-sm px-2 ">$10</CardAction>
                </CardHeader>
                <CardContent>Total users count</CardContent>
                <CardFooter>visitors for the last 6 months</CardFooter>
              </Card>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>10</CardDescription>
                  <CardAction className="border rounded-sm px-2 ">$10</CardAction>
                </CardHeader>
                <CardContent>Total users count</CardContent>
                <CardFooter>visitors for the last 6 months</CardFooter>
              </Card>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>10</CardDescription>
                  <CardAction className="border rounded-sm px-2 ">$10</CardAction>
                </CardHeader>
                <CardContent>Total users count</CardContent>
                <CardFooter>visitors for the last 6 months</CardFooter>
              </Card>
              <Card className="max-w-md">
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>10</CardDescription>
                  <CardAction className="border rounded-sm px-2 ">$10</CardAction>
                </CardHeader>
                <CardContent>Total users count</CardContent>
                <CardFooter>visitors for the last 6 months</CardFooter>
              </Card>

            </div>
          </SidebarFooter>
        </SidebarContent>
      </main>

    </SidebarProvider>
  )
}

export default Dashboard