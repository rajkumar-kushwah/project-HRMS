import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar"
import { AppSidebar } from "../components/app-sidebar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card"

const Dashboard = () => {
  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1 p-6">
        <SidebarTrigger />

        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Total Employees</CardTitle>
              <CardDescription>120</CardDescription>
            </CardHeader>
            <CardContent>Active employees in company</CardContent>
            <CardFooter>Updated today</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Present Today</CardTitle>
              <CardDescription>95</CardDescription>
            </CardHeader>
            <CardContent>Employees present today</CardContent>
            <CardFooter>Attendance report</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Pending Leaves</CardTitle>
              <CardDescription>8</CardDescription>
            </CardHeader>
            <CardContent>Leave requests waiting approval</CardContent>
            <CardFooter>HR review needed</CardFooter>
          </Card>

          <Card className="hover:scale-105 duration-300 ease-in-out">
            <CardHeader>
              <CardTitle>Monthly Payroll</CardTitle>
              <CardDescription>₹8,50,000</CardDescription>
            </CardHeader>
            <CardContent>Total salary this month</CardContent>
            <CardFooter>Payroll summary</CardFooter>
          </Card>

        </div>
      </main>
    </SidebarProvider>
  )
}

export default Dashboard