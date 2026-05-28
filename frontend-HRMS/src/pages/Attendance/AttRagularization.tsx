
import { Button } from "@/components/ui/button"
import { FileText, Filter, Send, CircleCheckBig, CircleX, TriangleAlert, } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"


function AttRagularization() {
  const [open, setOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [loading2, setLoading2] = React.useState(false)

  const handleApprove = () => {
    setLoading(true)

    setTimeout(() => {
      toast.success("Request Approved")
      setLoading(false)
    }, 2000)
  }
  const handleReject = () => {
    setLoading2(true)

    setTimeout(() => {
      toast.error("Request Rejected")
      setLoading2(false)
    }, 2000)
  }

  const requests = [
    {
      id: 1,
      employee: "John Doe",
      employeeId: "EMP001",
      status: "Pending",
      date: "25/05/2026",
      checkIn: "09:15",
      checkOut: "18:30",
      type: "Missing Check-out",
      reason: "System issue - forgot to checkout",
      requestedOn: "2026-05-26 10:30",
    },

    {
      id: 2,
      employee: "Sarah Wilson",
      employeeId: "EMP002",
      status: "Approved",
      date: "24/05/2026",
      checkIn: "09:00",
      checkOut: "18:00",
      type: "Wrong Time",
      reason: "Actual time was different due to client meeting",
      requestedOn: "2026-05-25 14:20",
      processedBy: "HR Manager",
      processedOn: "2026-05-25 16:45",
    },
    {
      id: 3,
      employee: "Michael Johnson",
      employeeId: "EMP003",
      status: "Rejected",
      date: "23/05/2026",
      checkIn: "08:30",
      checkOut: "17:45",
      type: "Missing Check-in",
      reason: "System issue - forgot to checkin",
      requestedOn: "2026-05-24 09:00",
      processedBy: "HR Manager",
      processedOn: "2026-05-24 10:15",
    }
  ];



  return (
    <div>

      <div className="flex flex-wrap items-center justify-between p-4 w-full">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-3">
          <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </div>
          {/* title and subtitle */}
          <div>
            <h1 className="text-2xl font-light">Attendance Regularization</h1>
            <p className="text-xs text-gray-500">Request corrections for attendance records</p>
          </div>
        </div>

        {/* RIGHT SIDE btn and dialog request form */}
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="cursor-pointer ">
                <Send className="w-4 h-4 mr-2" />
                New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-106.25rem">
              <DialogHeader>
                <DialogTitle className=" flex rounded-lg ">
                  <Send className="w-4 h-4 mr-2" />
                  Submit Regularization Request
                </DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <form>
                <div className="space-y-5 p-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                    <div>
                      <Label className="mb-1 block">Attendance Date *</Label>
                      <Input type="date" />
                    </div>
                    <div>
                      <Label className="mb-1 block">Request Type *</Label>
                      <Input type="text" placeholder="Request Type" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="mb-1 block">Request Check-in Time *</Label>
                      <Input type="text" placeholder="Request Check-in Time" />
                    </div>
                    <div>
                      <Label className="mb-1 block">Request Check-out Time *</Label>
                      <Input type="text" placeholder="Request Check-out Time" />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2">Reason for Regularization *</Label>
                    <Textarea placeholder="Please provide a detailed Reason for this Regularization request..." />
                  </div>
                  <div className="flex justify-end items-center gap-2 mt-4">
                    <Button variant="outline" type="reset" className=" cursor-pointer" >Cancel</Button>

                    <Button variant="outline" className=" cursor-pointer" type="submit"><Send className="w-4 h-4 mr-2" />Submit Request</Button>
                  </div>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* tabs */}

      <Tabs defaultValue="tab1" className="w-full">
        <div className="bg-card flex items-center shadow rounded-2xl p-4 w-full">
          <Filter className="w-4 h-4 mr-2" />
          <TabsList className="bg-card flex gap-2">
            <TabsTrigger value="tab1" className="bg-card data-[state=active]:bg-muted data-[state=active]:text-card-foreground  cursor-pointer px-4 py-1 rounded-lg text-sm hover:bg-muted/80 text-foreground border  transition ">All</TabsTrigger>
            <TabsTrigger value="tab2" className="bg-card data-[state=active]:bg-muted data-[state=active]:text-card-foreground  cursor-pointer px-4 py-1 rounded-lg text-sm hover:bg-muted/80 text-foreground border  transition ">Pending</TabsTrigger>
            <TabsTrigger value="tab3" className="bg-card data-[state=active]:bg-muted data-[state=active]:text-card-foreground  cursor-pointer px-4 py-1 rounded-lg text-sm hover:bg-muted/80 text-foreground border  transition ">Approved</TabsTrigger>
            <TabsTrigger value="tab4" className="bg-card data-[state=active]:bg-muted data-[state=active]:text-card-foreground  cursor-pointer px-4 py-1 rounded-lg text-sm hover:bg-muted/80 text-foreground border  transition ">Rejected</TabsTrigger>

          </TabsList>
        </div>

        {/* tab content1 */}
        <div className="mt-5 bg-card rounded-xl shadow p-4">
          {/* {tab1} */}
          <TabsContent value="tab1">
            <div className="grid gap-4">

              {requests.map((item) => (
                <Card key={item.id} className="rounded-xl shadow">

                  {/* Header */}
                  <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">
                          {item.employee}
                        </CardTitle>

                        <div
                          className={`text-xs font-medium border rounded-2xl px-2 py-0 flex justify-center items-center gap-1
                             ${item.status === "Pending"
                              ? "text-yellow-700 bg-yellow-600/25"
                              : item.status === "Approved"
                                ? "text-green-700 bg-green-600/25"
                                : "text-red-700 bg-red-600/25"
                            }`}
                        >
                          {item.status === "Pending" && (
                            <TriangleAlert className="w-3 h-3" />
                          )}

                          {item.status === "Approved" && (
                            <CircleCheckBig className="w-3 h-3" />
                          )}

                          {item.status === "Rejected" && (
                            <CircleX className="w-3 h-3" />
                          )}
                          {item.status}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="font-medium text-sm">Employee ID :</CardTitle>
                        <CardDescription>
                          {item.employeeId}
                        </CardDescription>
                      </div>
                    </div>

                    {/* buttons */}
                    {item.status === "Pending" && (
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs bg-green-500 hover:bg-green-600 "
                          // onClick={() => toast.success("Request Approved")}
                          onClick={handleApprove}
                        >
                          {loading ? (<Spinner />) : (<CircleCheckBig className="w-3 h-3" />)}
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs border-red-500 hover:text-red-600 text-red-500 "
                          // onClick={() => toast.error("Request Rejected")}
                          onClick={handleReject}
                        >
                          {/* <CircleX className="w-3 h-3" /> */}
                          {loading2 ? (<Spinner />) : (<CircleX className="w-3 h-3" />)}
                          Reject
                        </Button>
                      </div>
                    )}
                  </CardHeader>

                  {/* Body */}
                  <CardContent className="space-y-4">

                    {/* details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                      <div className="flex gap-2 items-center">
                        <CardTitle className="font-medium">Date: </CardTitle>
                        <CardDescription>{item.date}</CardDescription>
                      </div>

                      <div className="flex gap-2 items-center">
                        <CardTitle className="font-medium">Check-in:</CardTitle>
                        <CardDescription> {item.checkIn}</CardDescription>
                      </div>

                      <div className="flex gap-2 items-center">
                        <CardTitle className="font-medium">Check-out:</CardTitle>
                        <CardDescription> {item.checkOut}</CardDescription>
                      </div>

                    </div>

                    {/* type */}
                    <div className="bg-muted overflow-auto flex flex-col gap-2 p-4 rounded-lg">
                      <div>
                        <CardTitle className="flex gap-2 font-medium text-sm">Type: <CardDescription>
                          {item.type}
                        </CardDescription> </CardTitle>
                      </div>
                      {/* reason */}
                      <div>
                        <CardTitle className="flex gap-2 font-medium text-sm">
                          Reason:<CardDescription>
                            {item.reason}
                          </CardDescription>
                        </CardTitle>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        <CardTitle className="font-medium">
                          Requested On:
                        </CardTitle><CardDescription>
                          {" "} {item.requestedOn}
                        </CardDescription>
                      </div>

                      {item.processedBy && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <CardTitle className="font-medium">
                            Processed By:
                          </CardTitle>
                          <CardDescription>{" "}
                            {item.processedBy}</CardDescription>
                        </div>
                      )}

                      {item.processedOn && (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <CardTitle className="font-medium">
                            Processed On:
                          </CardTitle>
                          <CardDescription>{" "}
                            {item.processedOn}</CardDescription>
                        </div>
                      )}
                    </div>
                  </CardContent>

                  {/* Footer */}
                </Card>
              ))}

            </div>
          </TabsContent>

          {/* {tab2} */}
          <TabsContent value="tab2">
            <div className="grid gap-4">

              {requests
                .filter((item) => item.status === "Pending")
                .map((item) => (

                  <Card key={item.id} className="rounded-xl shadow">

                    {/* Header */}
                    <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">
                            {item.employee}
                          </CardTitle>

                          <p className="text-xs font-medium border rounded-2xl px-2 py-0 flex justify-center items-center gap-1 text-yellow-700 bg-yellow-400/25">
                            <TriangleAlert className="w-3 h-3" />
                            {item.status}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <CardTitle className="font-medium text-sm">Employee ID:</CardTitle>
                          <CardDescription>
                            {item.employeeId}
                          </CardDescription>
                        </div>
                      </div>

                      {/* buttons */}
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">

                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs bg-green-500 hover:bg-green-600"
                          // onClick={() => toast.success("Request Approved")}
                          onClick={handleApprove}
                        >
                          {/* <CircleCheckBig className="w-3 h-3" /> */}
                          {loading ? (<Spinner />) : (<CircleCheckBig className="w-3 h-3" />)}
                          Approve
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="cursor-pointer text-xs border-red-500 hover:text-red-600 text-red-500"
                          // onClick={() => toast.error("Request Rejected")}
                          onClick={handleReject}
                        >
                          {/* <CircleX className="w-3 h-3" /> */}
                          {loading2 ? (<Spinner />) : (<CircleX className="w-3 h-3" />)}
                          Reject
                        </Button>

                      </div>

                    </CardHeader>

                    {/* Body */}
                    <CardContent className="space-y-4">

                      {/* details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">

                        <div className="flex gap-2 items-center">
                          <CardTitle className="font-medium">
                            Date:
                          </CardTitle>

                          <CardDescription>
                            {item.date}
                          </CardDescription>
                        </div>

                        <div className="flex gap-2 items-center">
                          <CardTitle className="font-medium">
                            Check-in:
                          </CardTitle>

                          <CardDescription>
                            {item.checkIn}
                          </CardDescription>
                        </div>

                        <div className="flex gap-2 items-center">
                          <CardTitle className="font-medium">
                            Check-out:
                          </CardTitle>

                          <CardDescription>
                            {item.checkOut}
                          </CardDescription>
                        </div>

                      </div>

                      {/* info box */}
                      <div className="bg-muted flex flex-col gap-2 p-4 rounded-lg">

                        <div>
                          <CardTitle className="flex gap-2 font-medium text-sm">
                            Type:

                            <CardDescription>
                              {item.type}
                            </CardDescription>
                          </CardTitle>
                        </div>

                        <div>
                          <CardTitle className="flex gap-2 font-medium text-sm">
                            Reason:

                            <CardDescription>
                              {item.reason}
                            </CardDescription>
                          </CardTitle>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                          <CardTitle className="font-medium">
                            Requested On:
                          </CardTitle>

                          <CardDescription>
                            {item.requestedOn}
                          </CardDescription>
                        </div>

                      </div>

                    </CardContent>

                  </Card>
                ))}

            </div>
          </TabsContent>

          {/* {tab3} */}
          <TabsContent value="tab3">
            <div className="grid gap-4">
              {requests.filter((item) => item.status === "Approved").map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{item.employee}</CardTitle>
                        <div className={`text-xs font-medium border rounded-2xl px-2 py-0 flex justify-center items-center gap-1
                        ${item.status === "Approved"
                            ? "text-green-700 bg-green-600/25"
                            : item.status === "Pending"
                              ? "text-yellow-700 bg-yellow-400/25"
                              : "text-red-700 bg-red-600/25"
                          }`}>

                          <CircleCheckBig className="w-3 h-3" />
                          {item.status}

                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Employee ID :</CardTitle>
                        <CardDescription>
                          {item.employeeId}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Body */}
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Date :</CardTitle>
                        <CardDescription>
                          {item.date}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Check-in :</CardTitle>
                        <CardDescription>
                          {item.checkIn}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Check-out :</CardTitle>
                        <CardDescription>
                          {item.checkOut}
                        </CardDescription>
                      </div>
                    </div>


                    {/* type */}
                    <div className="bg-muted flex flex-col gap-2 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Type:</CardTitle>
                        <CardDescription>
                          {item.type}
                        </CardDescription>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                        <CardTitle className="text-sm shrink-0"> Reason: </CardTitle>

                        <CardDescription className="wrap-break-word">
                          {item.reason}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Requested On:</CardTitle>
                        <CardDescription>
                          {item.requestedOn}
                        </CardDescription>
                      </div>


                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">ProcessedBy On:</CardTitle>
                        <CardDescription>
                          {item.processedBy}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Processed On:</CardTitle>
                        <CardDescription>
                          {item.processedOn}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>


          {/* {tab4} */}
          <TabsContent value="tab4">
            <div className="grid gap-4">
              {requests.filter((item) => item.status === "Rejected").map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle>{item.employee}</CardTitle>
                        <div className={`text-xs font-medium border rounded-2xl px-2 py-0 flex justify-center items-center gap-1
                        ${item.status === "Rejected"
                            ? "text-red-700 bg-red-600/25"
                            : item.status === "Pending"
                              ? "text-yellow-700 bg-yellow-400/25"
                              : "text-green-700 bg-green-600/25"
                          }`}>

                          <CircleCheckBig className="w-3 h-3" />
                          {item.status}

                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Employee ID :</CardTitle>
                        <CardDescription>
                          {item.employeeId}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  {/* Body */}
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Date :</CardTitle>
                        <CardDescription>
                          {item.date}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Check-in :</CardTitle>
                        <CardDescription>
                          {item.checkIn}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Check-out :</CardTitle>
                        <CardDescription>
                          {item.checkOut}
                        </CardDescription>
                      </div>
                    </div>


                    {/* type */}
                    <div className="bg-muted flex flex-col gap-2 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Type:</CardTitle>
                        <CardDescription>
                          {item.type}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Reason:</CardTitle>
                        <CardDescription>
                          {item.reason}
                        </CardDescription>
                      </div>

                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Requested On:</CardTitle>
                        <CardDescription>
                          {item.requestedOn}
                        </CardDescription>
                      </div>


                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">ProcessedBy On:</CardTitle>
                        <CardDescription>
                          {item.processedBy}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm">Processed On:</CardTitle>
                        <CardDescription>
                          {item.processedOn}
                        </CardDescription>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

        </div>
      </Tabs >

    </div >
  )
}

export default AttRagularization
