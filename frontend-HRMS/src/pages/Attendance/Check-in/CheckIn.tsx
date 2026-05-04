import { AppSidebar } from '@/components/app-sidebar'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Clock, MapPin, LogIn, Award, Users, AlarmClockIcon, LineChart, CircleCheck, } from 'lucide-react'
import React, { useEffect } from 'react'
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TableHead, TableHeader, TableRow, TableBody, TableCell, Table } from '@/components/ui/table'
import { getAttendance, checkIn, checkOut } from '@/controllers/checkIn.controller'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/pages/context/AuthContext'
import { toast } from 'sonner'
import { AxiosError } from 'axios'


interface Attendance {
  user: {
    name: string;
  }
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  totalMinutes: number;
  overtimeMinutes: number;
  status: string;
  EmpStatus: string;
}

type ApiError = {
  message: string;
}

const CheckIn = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [attendanceData, setAttendanceData] = React.useState<Attendance[]>([]);

  const [checkedIn, setCheckedIn] = React.useState(false);
  const [checkInTime, setCheckInTime] = React.useState<Date | null>(null);
  const [duration, setDuration] = React.useState("0:00:00");


  const handleCheckIn = async () => {
    try {
      if (!checkedIn) {
        const res = await checkIn();
        console.log("API DATA:", res.data.data);
        toast.success(res.data.message || "Checked in successfully");

        const now = new Date();
        setCheckedIn(true);
        setCheckInTime(now);


        setAttendanceData(prev => [res.data.data, ...prev]);

      } else {
        await checkOut();

        toast.success("Checked out successfully");

        const now = new Date();

        setCheckedIn(false);
        setAttendanceData((prev) => {
          const updated = [...prev];
          const lastEntry = updated[0];

          if (lastEntry && !lastEntry.checkOut) {
            lastEntry.checkOut = now.toISOString();

            const diff = (now.getTime() - checkInTime!.getTime()) / 1000;

            // const hours = Math.floor(diff / 3600);
            // const minutes = Math.floor((diff % 3600) / 60);
            // total minutes
            const totalMinutes = Math.floor(diff / 60);

            // lastEntry.totalHours = `${hours}h ${minutes}m`;
            // save number only
            lastEntry.totalMinutes = totalMinutes;
          }

          return updated;
        });

        setCheckInTime(null);
        // setCheckedIn(false);
        setDuration("0:00:00");
      }
    }
    catch (err: unknown) {
      const error = err as AxiosError<ApiError>;

      toast.error(error.response?.data?.message ?? "Something went wrong");

      console.error("Attendance error:", err);
    }
  };


  // Page load pe backend se check kro 
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await getAttendance();

        const data = res.data.data;

        // table ke liye
        setAttendanceData(data);

        // button state ke liye
        const lastEntry = data?.[0];
        // const active = lastEntry && !lastEntry.checkOut;

        if (lastEntry && !lastEntry.checkOut) {
          setCheckedIn(true);
          // setCheckInTime(active ? new Date(lastEntry.checkIn) : null);
          setCheckInTime(new Date(lastEntry.checkIn));
        } else {
          setCheckedIn(false);
          setCheckInTime(null);
        }

      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    fetchAttendance();
  }, []);

  // sort of data teble renge minimum to maximum 1 to 5 
  // const visivleData = attendanceData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());


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

  const formatDuration = (minutes: number) => {
    if (!minutes) return "-";

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hours}h ${mins}m`;
  };


  const visivleData = React.useMemo(() => {
    return attendanceData.slice(-5);
  }, [attendanceData]);




  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

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





  // data ko usable formate me convert krne ke liye attedanaceData ko map krne ke liye card ko map krne ke liye

  const totalDays = attendanceData.length;

  const totalHours = attendanceData.reduce((acc, item) => {
    if (!item?.totalMinutes) return acc;

    const cleaned = String(item.totalMinutes)
      .replace("h", "")
      .replace("m", "")
      .trim();

    const [h = 0, m = 0] = cleaned.split(" ").map(Number);

    return acc + h + m / 60;
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
            {checkedIn && user?.role?.name || user?.roles?.[0] === "EMPLOYEE" && (
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
              {user?.role?.name || user?.roles?.[0] === "EMPLOYEE" && (
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
              )}
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


            <Button
              variant="outline"
              className="text-xs cursor-pointer"
              onClick={() => navigate("/attendance-history")}
            >
              View All
            </Button>




          </div>
        </div>

        {/* teble goes here */}
        <div className='bg-white p-6 grid grid-cols-1 rounded border w-full overflow-x-auto'>
          {/* table goes here */}

          <Table >
            <TableHeader>
              <TableRow>
                <TableCell className="">Name</TableCell>
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
                  <TableCell className="font-medium">{item.user?.name}</TableCell>
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
                  <TableCell>{formatDuration(item.totalMinutes)}</TableCell>
                  <TableCell>{formatDuration(item.overtimeMinutes)}</TableCell>
                  <TableCell>
                    <span className="px-2 py-0 rounded-lg text-xs border ">{item.status}</span>

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
