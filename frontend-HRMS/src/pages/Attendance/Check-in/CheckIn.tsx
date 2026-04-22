import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Clock, MapPin, LogIn, Award, Users, AlarmClockIcon, LineChart, CircleCheck, } from 'lucide-react'
import React from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TableHead, TableHeader, TableRow, TableBody, TableCell, Table } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getAttendance, checkIn,checkOut } from '@/controllers/checkIn.controller'



const CheckIn = () => {

  // const TebleData = [
  //   {
  //     id: 1,
  //     date: "2023-04-01",
  //     checkIn: "10:30 AM",
  //     checkOut: "6:00 PM",
  //     totalHours: "1:00 hours",
  //     status: "Present"
  //   },
  //   {
  //     id: 2,
  //     date: "2023-03-01",
  //     checkIn: "9:00 AM",
  //     checkOut: "6:00 PM",
  //     totalHours: "1:00 hours",
  //     status: "Present"
  //   },
  //   {
  //     id: 3,
  //     date: "2023-02-01",
  //     checkIn: "9:00 AM",
  //     checkOut: "6:00 PM",
  //     totalHours: "1:00 hours",
  //     status: "Present"
  //   },
  // ]

  const [attendanceData, setAttendanceData] = React.useState<any[]>([]);

  const [checkedIn, setCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<Date | null>(null);
  const [duration, setDuration] = React.useState("0:00:00");

  const handleCheckIn = async () => {
    if (!checkedIn) {
      await checkIn();
      const now = new Date();
      setCheckedIn(true);
      setCheckInTime(now);

      const newEntry = {
        id: Date.now(),
        date: now.toLocaleDateString(),
        checkIn: now.toLocaleTimeString(),
        CheckOut: "",
        totalHours: "",
        overtime: "0:00:00",
        status: "Present",
      };
      setAttendanceData([...attendanceData, newEntry]);

    } else {
      await checkOut();
      const now = new Date();

      setCheckedIn(false);
      setAttendanceData((prev) => {
        const updated = [...prev];
        const lastEntry = updated[updated.length - 1];

        if (lastEntry && !lastEntry.checkOut) {
          lastEntry.checkOut = new Date().toLocaleTimeString();
          const diff = (now.getTime() - checkInTime!.getTime()) / 1000;

          const hours = Math.floor(diff / 3600);
          const minutes = Math.floor((diff % 3600) / 60);

          lastEntry.totalHours = `${hours}h ${minutes}m`;
        }
        return updated;
      })

      setCheckInTime(null);
      // setCheckedIn(false);
      setDuration("0:00:00");
    }
  }

  

  // sort of data teble renge minimum to maximum 1 to 5 
  // const visivleData = attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());



const fetchAttendance = async () => {
  try {
    const res = await getAttendance();
    setAttendanceData(res.data.data);
  } catch (err) {
    console.error("Fetch error:", err);
  }
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
};
const formatTime = (date: string) => {
  return new Date(date).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};


  const visivleData = React.useMemo(() => {
    return attendanceData.slice(-5);
  }, [attendanceData]);

  React.useEffect(() => {
  fetchAttendance();
}, []);

  //  check in checkout status late early

  const getStatus = (checkInTime: string) => {
    const OfficeTime = new Date();
    OfficeTime.setHours(9, 30, 0);

    const [time, modifier] = checkInTime.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    const checkInDate = new Date();
    checkInDate.setHours(hours, minutes, 0);

    return checkInDate > OfficeTime ? "Late" : "Early";
  }

  React.useEffect(() => {
    let interval: any;

    if (checkedIn && checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = (now.getTime() - checkInTime.getTime()) / 1000;

        const h = Math.floor(diff / 3600);
        const m = Math.floor((diff % 3600) / 60);
        const s = Math.floor(diff % 60);

        setDuration(`${h}:${m}:${s}`);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [checkedIn, checkInTime]);

  // overtime

  // const calculateOvertime = (totalHours: string) => {
  //   const [hours, minutes] = totalHours.split(":").map(Number);
  //   const totalMinutes = hours * 60 + minutes;
  //   const overtime = totalMinutes > 480 ? totalMinutes - 480 : 0;
  //   return `${Math.floor(overtime / 60)}:${overtime % 60}`;
  // }

  // data ko usable formate me convert krne ke liye attedanaceData ko map krne ke liye card ko map krne ke liye

  const totalDays = attendanceData.length;

  const totalHours = attendanceData.reduce((acc, item) => {
    if (!item.totalHours) return acc;

    const [h, m] = item.totalHours.split(" ");
    const hours = parseInt(h);
    const minutes = parseInt(m);

    return acc + hours + minutes / 60;
  }, 0);

  const AvgHours = totalDays < 0
    ? (totalHours / totalHours).toFixed(1)
    : 0;


  const onTimeDays = attendanceData.filter(item => {
    if (!item.checkIn) return false;

    const [time, modifier] = item.checkIn.split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier === "PM" && hours !== 12) hours += 12;
    if (modifier === "AM" && hours === 12) hours = 0;

    return hours < 9 || (hours === 9 && minutes <= 30);
  }).length;

  const attendanceRate = totalDays > 0
    ? Math.round((totalDays / 30) * 100)
    : 0;

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 p-3 '>
        <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
          <SidebarTrigger />
        </div>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between  rounded-2xl shadow p-4 w-full">

            {/* LEFT SIDE */}
            <div className="flex items-center gap-3">
              <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                <Clock />
              </div>
              {/* title and subtitle */}
              <div>
                <h1 className="text-2xl font-light">Check In / Check Out</h1>
                <p className="text-xs text-gray-500">Track your daily attendance and working hours</p>
              </div>
            </div>

            {/* RIGHT SIDE */}
            {/* <div>
              <Button variant="outline" className="cursor-pointer">
                <Upload className="mr-2" />
                Bulk Upload
              </Button>
            </div> */}

          </div>
        </div>

        {/* check in /out card */}
        <div>
          <Card>
            <CardHeader>
              <div className='flex justify-between p-4 items-center '>
                <div className='grid grid-col-1 gap-1'>
                  <CardTitle className='font-medium text-2xl'> Ready to Start your Day ?</CardTitle>
                  <CardDescription>Mark your Attendance to begin</CardDescription>
                </div>
                <div className='shadow w-15 h-15 flex items-center justify-center rounded-lg'>
                  <Clock className='w-10 h-10' />
                </div>
              </div>
            </CardHeader>

            {/* check in time and work duration */}
            {checkedIn && (
              <div className="animate-in fade-in duration-200 zoom-in-95">
                <CardContent className='grid grid-cols-1 sm:grid-cols-2 gap-3 border p-4 rounded-lg justify-between w-[90%] mx-auto'>
                  <div>
                    {/* check in time */}
                    <p className='text-xs'>Check In Time</p>
                    <p>{checkInTime?.toLocaleTimeString()}</p>
                  </div>
                  <div>
                    {/* Wrok Duration */}
                    <p className='text-xs'> Work Duration</p>
                    <p>{duration}</p>
                  </div>
                </CardContent>
              </div>
            )}

            {/* content goes here check in Button and check out */}
            <div >
              <Button variant="outline"
                onClick={handleCheckIn}
                className={`grid text-ms cursor-pointer w-[90%] mx-auto  ${checkedIn ? "bg-red-400 hover:bg-red-500" : "bg-blue-500 hover:bg-blue-600 text-white"
                  } `}>

                <div className='flex justify-center items-center gap-2'>
                  <LogIn className="w-4 h-4 " />

                  <span className="truncate">
                    {checkedIn ? "Check Out" : "Check In Now"}
                  </span>
                </div>
              </Button>
            </div>

            {/* location */}
            <CardFooter >
              <MapPin className='w-4 h-4' />
              <CardAction className='text-xs'>Location: Office -Main Building, Floor 3</CardAction>
            </CardFooter>
          </Card>
        </div>
        {/* Attendance Rate card goes here */}
        <div className=' grid grid-cols-1 sm:grid-cols-2 gap-2'>
          {/* Attendance Rate */}
          <Card className='flex flex-col mt-4 py-3 px-2 hover:shadow-md transition p-2'>
            <CardHeader className='border-b'>
              <Award className='w-8 h-8' />
              <CardTitle>Attendance Rate</CardTitle>
              <CardDescription>{attendanceRate}%</CardDescription>
              <CardAction className='text-xs border rounded-lg px-2 py-0'>This month</CardAction>

            </CardHeader>
            <CardFooter className='mb-2'>
              <p className='text-xs '>{totalDays} day present out of 25 </p>
            </CardFooter>
          </Card>

          {/* Member Present */}
          <Card className='flex flex-col mt-4 py-3 px-2  hover:shadow-md transition p-2' >
            <CardHeader className='border-b'>
              <Users className='w-8 h-8' />
              <CardDescription>{totalDays}/30</CardDescription>
              <CardTitle>Member Present</CardTitle>
              <CardAction className='text-xs border rounded-lg px-2 py-0'>Team</CardAction>
            </CardHeader>
            <CardFooter className='mb-2'>
              <p className='text-xs '>Engineering Department </p>
            </CardFooter>
          </Card>
        </div>


        {/* this week attendance hrs and this month attendance hrs and this year attendance hrs */}
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-5'>
          <Card className=' hover:shadow-md transition p-2'>
            <CardHeader>
              <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                <AlarmClockIcon className='w-5 h-5 ' />
              </div>
              <CardTitle>{totalHours.toFixed(1)} hrs</CardTitle>
              <CardDescription>This week </CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>

          {/* this month attendance hrs */}
          <Card className=' hover:shadow-md transition p-2'>
            <CardHeader>
              <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                <LineChart className='w-5 h-5' />
              </div>
              <CardTitle>{totalDays}/30</CardTitle>
              <CardDescription>This month</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>

          {/* this month attendance hrs */}
          <Card className=' hover:shadow-md transition p-2'>
            <CardHeader>
              <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                <CircleCheck className='w-5 h-5' />
              </div>
              <CardTitle>{onTimeDays}/{totalDays}</CardTitle>
              <CardDescription>On Time Days</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>

          {/* avg hours */}
          <Card className=' hover:shadow-md transition p-2'>
            <CardHeader>
              <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                <Clock className='w-5 h-5' />
              </div>
              <CardTitle>{AvgHours} hrs</CardTitle>
              <CardDescription>Avg Hours/Day</CardDescription>
            </CardHeader>
            <CardContent>

            </CardContent>
          </Card>
        </div>

        {/* recent attendance history header teble */}
        <div className=' flex bg-gray-100 gap-2 items-center justify-between mt-5 transparent border  rounded p-6'>

          <h1>Recent Attendance History</h1>
          <div>
            {/* <Button variant="outline" className='text-xs cursor-pointer'>
              View All
            </Button> */}

            {/* view all table dialog */}
            <div >

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className='text-xs cursor-pointer'>View All</Button>
                </DialogTrigger>
                <DialogContent className="max-w-96 max-h-[80vh] overflow-y-auto  ">
                  <DialogHeader>
                    <DialogTitle>Attendance History</DialogTitle>
                    <DialogDescription>Full attendance history</DialogDescription>
                  </DialogHeader>
                  <div className='bg-white p-6 grid grid-cols-1 rounded border w-full overflow-x-auto'>

                    {/* filter input and button */}
                    <div className='flex items-center gap-2'>
                      <Input placeholder='Filter by name or date' />
                      <Button variant="outline" className='text-xs cursor-pointer'>Filter</Button>
                    </div>

                    {/* table goes here */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className='text-xs'>Date</TableHead>
                          <TableHead className='text-xs'>Check In</TableHead>
                          <TableHead className='text-xs'>Check Out</TableHead>
                          <TableHead className='text-xs'>Total Hours</TableHead>
                          <TableHead className='text-xs'>Over Time</TableHead>
                          <TableHead className='text-xs'>Status</TableHead>
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {attendanceData.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{formatDate(item.date)}</TableCell>
                            <TableCell>{formatTime(item.checkIn)}</TableCell>
                            <TableCell>{formatTime(item.checkOut)}</TableCell>
                            <TableCell>{item.totalHours}</TableCell>
                            <TableCell>{item.overtime}</TableCell>
                            <TableCell>{item.status}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

          </div>
        </div>

        {/* teble goes here */}
        <div className='bg-white p-6 grid grid-cols-1 rounded border w-full overflow-x-auto'>
          {/* table goes here */}

          <Table >
            <TableHeader>
              <TableRow>
                <TableHead className="" >Date</TableHead>
                <TableHead className="">Check In</TableHead>
                <TableHead className="">Check Out</TableHead>
                <TableHead className="">Total Hours</TableHead>
                <TableHead className="">Over Time</TableHead>
                <TableHead className="">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visivleData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{formatDate(item.date)}</TableCell>
                  <TableCell >
                    <div className='flex justify-center items-center gap-1'>
                      <LogIn className="w-3 h-3 text-green-500 " />
                      {formatTime(item.checkIn)}
                    </div>
                  </TableCell>
                  <TableCell >
                    <div className='flex justify-center items-center gap-1'>
                      <LogIn className="w-3 h-3 text-red-500 " />
                      {formatTime(item.checkOut)}
                    </div>
                  </TableCell>
                  <TableCell>{item.totalHours}</TableCell>
                  <TableCell>{item.overtime}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-0 rounded-lg text-xs border ${getStatus}`}>{getStatus(item.checkIn)}</span>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

          </Table>

        </div>
      </main>
    </SidebarProvider>
  )
}

export default CheckIn
