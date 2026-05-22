// import { AppSidebar } from '@/components/app-sidebar'
// import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Calendar, ChevronDown, FileText, Filter, Key, LogIn } from 'lucide-react'
import { Select } from 'radix-ui'
import React from 'react'
import { Tabs } from 'radix-ui'
import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { getMonthlyAttendance, filterMonthlyAttendance } from '@/controllers/monthlyAttendance.controller'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'



interface Attendance {
  id: number;
  date: string; // ISO string from backend
  checkIn?: string;
  checkOut?: string;
  totalHours?: number;
  overtime?: number;
  status: string; // P, A, Late, WO etc.
  EmpStatus: string;
  userId: number;
  user?: {
    id: number;
    name?: string;
    email?: string;

    employee?: {
      id: number;
      firstName: string;
      lastName: string;
      isActive: boolean;

      department?: {
        id: number;
        name: string;
      };
    };
  };
}
function MonthlyAttendance() {


  const [currentPage, setCurrentPage] = React.useState(1);
  const [open, setOpen] = React.useState(false)
  const [monthlyData, setMonthlyData] = React.useState<Attendance[]>([])
  const [selectMonth, setSelectMonth] = React.useState(new Date().getMonth() + 1);
  const [selectYear, setSelectYear] = React.useState(new Date().getFullYear());
  const [filter, setFilter] = React.useState(false);
  const currentDate = new Date();
  const [filters, setFilters] = React.useState({
    month: currentDate.getMonth() + 1,
    year: currentDate.getFullYear(),
    name: '',
    status: '',
    date: '',
  })

  // calendar month and year
  const today = new Date();
  // const currentMonth = today.getMonth() + 1;
  const currentYear = today.getFullYear();

  // select month droup
  const monthOptions = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    year: currentYear,
    value: `${index + 1}-${currentYear}`,
    label: new Date(currentYear, index).toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    })
  }))

  const fetchMonthlyAttendance = async () => {
    try {
      const res = await getMonthlyAttendance(selectMonth, selectYear);
      // const calendar = generateMonthDays(currentMonth, currentYear);
      // const merged = margeAttendance(calendar, res.data.data);
      setMonthlyData(res.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  React.useEffect(() => {
    fetchMonthlyAttendance();
  }, [selectMonth, selectYear]);



  // Onchange filter function

  const handleFilterChange = (Key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [Key]: value
    }))
  }

  // handle filter function

  const handleApplyFilter = async () => {
    try {
      const res = await filterMonthlyAttendance({
        month: selectMonth,
        year: selectYear,
        status: filters.status,
      });

      let filteredData = res.data.data;

      // name filter frontend
      if (filters.name) {
        filteredData = filteredData.filter((item: Attendance) => {
          const fullName =
            `${item.user?.employee?.firstName} ${item.user?.employee?.lastName}`
              .toLowerCase();

          return fullName.includes(
            filters.name.toLowerCase()
          );
        });
      }

      setMonthlyData(filteredData);

    } catch (error) {
      console.error(error);
    }
  };

  // clear filter
  const handleClearFilter = async () => {
    setFilters({
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      name: "",
      status: "",
      date: "",
    });
    await fetchMonthlyAttendance();
  };

  const generateDays = (month: number, year: number) => {
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const daysInMonth = new Date(year, month, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const dayNumber = i + 1;
      const date = new Date(year, month - 1, dayNumber);

      const isSunday = date.getDay() === 0;

      let status = "-";

      //  ONLY past + today allowed
      const isPastOrToday =
        year < currentYear ||
        (year === currentYear && month < currentMonth) ||
        (year === currentYear && month === currentMonth && dayNumber <= currentDate);

      if (isPastOrToday) {
        if (isSunday) {
          status = "WO";
        } else if (dayNumber < currentDate) {
          status = "A";
        } else {
          status = "P"; // today default (or Late if API says)
        }
      } else {
        status = "-"; // FUTURE FIX HERE 
      }

      return {
        day: dayNumber,
        label: date.toLocaleDateString("en-US", { weekday: "short" }),
        status,
        isSunday,
      };
    });
  };

  const days = generateDays(selectMonth, selectYear);

  const attendanceMap = monthlyData.reduce((acc: any, item) => {
    const empId = item.user?.employee?.id;
    if (!empId) return acc;

    if (!acc[empId]) acc[empId] = {};

    const day = new Date(item.date).getDate();
    acc[empId][day] = item.status;

    return acc;
  }, {});

  // employee list for filter
  const employees = Array.from(
    new Map(
      monthlyData
        .filter(i => i.user?.employee)
        .map(i => [i.user!.employee!.id, i.user!.employee!])
    ).values()
  );

  // color for status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "P":
        return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300";
      case "WO":
        return "bg-muted text-muted-foreground";
      case "Late":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300";
      case "A":
        return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
      default:
        return "bg-transparent text-foreground"; // "-" future days
    }
  };

  //  get final status
  const getFinalStatus = (empId: number, day: any) => {
    const today = new Date();

    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const apiStatus = attendanceMap?.[empId]?.[day.day];

    const isFuture =
      selectYear > currentYear ||
      (selectYear === currentYear &&
        selectMonth > currentMonth) ||
      (selectYear === currentYear &&
        selectMonth === currentMonth &&
        day.day > currentDate);

    if (isFuture) return "-";

    if (day.label === "Sun") return "WO";

    return apiStatus || "A";
  };

  const rowperPage = 7
  const startIndex = (currentPage - 1) * rowperPage;
  // const endIndex = startIndex + rowperPage;

  const uniqueEmployees = Array.from(
    new Map(
      monthlyData.map((item) => [item.userId, item])
    ).values()
  );

  const currentData = uniqueEmployees.slice(startIndex, startIndex + rowperPage);

  const totalPage = Math.ceil(uniqueEmployees.length / rowperPage)
  // const visiblePages = Math.max(totalPage, 5)


  // cards updates summery calculations

  let totalPresent = 0;
  let totalAbsent = 0;
  let totalLateArrivals = 0;
  let totalWorkOff = 0;

  employees.forEach((emp) => {
    days.forEach((day) => {
      const status = getFinalStatus(emp.id, day);

      if (status === "P") totalPresent++;
      if (status === "A") totalAbsent++;
      if (status === "Late") totalLateArrivals++;
      if (status === "WO") totalWorkOff++;
    })
  })

  const totalDays = employees.length * days.length

  // const totalPresent = monthlyData.filter((item) => item.status === "P").length;
  // const totalAbsent = monthlyData.filter((item) => item.status === "A").length;
  // const totalLateArrivals = monthlyData.filter((item) => item.user && item.status === "P").length;
  // const totalWorkOff = monthlyData.filter((item) => item.status === "WO").length;

  // percentage
  // const totalDays = monthlyData.length;

  const totalPresentPercentage = ((totalPresent / totalDays) * 100).toFixed(2);
  const totalAbsentPercentage = ((totalAbsent / totalDays) * 100).toFixed(2);
  const totalLateArrivalsPercentage = ((totalLateArrivals / totalDays) * 100).toFixed(2);
  const totalWorkOffPercentage = ((totalWorkOff / totalDays) * 100).toFixed(2);


  return (
    // <SidebarProvider>
    //   <AppSidebar />
    <div>
      <main className='flex-1 p-3 '>
        {/* <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
          <SidebarTrigger />
        </div> */}
        {/* <Tabs.Root defaultValue="tab1"> */}
        <Tabs.Root defaultValue="tab1">
          {/* Header */}
          <div className="mb-6">
            <div className="bg-card flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-2xl shadow p-4 gap-3">

              <div className='flex flex-col justify-between w-full '>
                <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full'>

                  {/* LEFT SIDE */}
                  <div className="flex  items-center gap-3">
                    <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                      <Calendar className='w-5 h-5' />
                    </div>

                    {/* title and subtitle */}
                    <div>
                      <h1 className="text-2xl font-light">Monthly Attendance Report</h1>
                      <p className="text-xs text-gray-500">Comprehensive monthly attendance tracking and analysis</p>
                    </div>
                  </div>

                  {/* RIGHT SIDE - month and year filter */}
                  <div>
                    {/* <h1 className="text-sm font-medium mb-1">*</h1> */}
                    <Select.Root open={open} onOpenChange={setOpen} onValueChange={(value) => {
                      const [month, year] = value.split("-");
                      setSelectMonth(Number(month));
                      setSelectYear(Number(year));
                    }} >
                      <Select.Trigger className="w-full border  rounded px-2 py-1 text-xs flex justify-between items-center gap-2">
                        <Calendar className='w-4 h-4' />
                        <Select.Value placeholder="Select a month" />
                        <ChevronDown className={`w-4 h-4 opacity-50 ${open && "rotate-180"}`} />

                      </Select.Trigger>

                      <Select.Content position='popper' sideOffset={4} className="bg-card w-(--radix-select-trigger-width) z-5 rounded shadow border-border data-[state=open]:animate-in data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 ">
                        {monthOptions.map((month) => (
                          <Select.Item key={month.value} value={String(month.value)} className="hover:bg-muted focus:bg-muted text-foreground px-2 py-1 text-xs cursor-pointer w-full">
                            <Select.ItemText>{month.label}</Select.ItemText>
                          </Select.Item>
                        ))}

                      </Select.Content>
                    </Select.Root>
                  </div>
                </div>

                {/*  NEW SECTION (tabs + actions buttons) */}
                <div className="flex flex-wrap  gap-2 pt-3">
                  {/* Tabs */}
                  <div className="flex  gap-2 justify-center items-center">

                    <Tabs.List className="bg-card flex  gap-2 rounded-lg">
                      <Tabs.Trigger value="tab2" className="bg-card px-3 py-1 text-sm cursor-pointer rounded-lg data-[state=active]:bg-muted ">
                        Summary
                      </Tabs.Trigger>
                      <Tabs.Trigger value="tab1" className="bg-card px-3 py-1 text-sm cursor-pointer rounded-lg data-[state=active]:bg-muted ">
                        Detail
                      </Tabs.Trigger>
                    </Tabs.List>

                  </div>

                  {/* Actions buttons */}
                  <div className="">
                    <div className=' '>
                      {/* <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1   ">
                        <Filter className="w-4 h-4" />
                        Filter
                      </Button> */}
                      {/* filter droupdown content  */}
                      <Select.Root >
                        <Select.Trigger asChild >
                          <Button
                            variant="outline"
                            className="text-xs cursor-pointer flex items-center justify-center gap-2 px-3 py-2"
                          >
                            <Filter className="w-4 h-4" />
                            Filter
                          </Button>
                        </Select.Trigger>

                        <Select.Content
                          position="popper"
                          sideOffset={4}
                          className="bg-card border rounded-lg shadow-md p-4 w-64 z-50 data-open:animate-in data-[state=open]: animate-in data-[state=closed]: zoom-out-95 data-[state=open]: zoom-in-95 "
                        >
                          <div className="space-y-4">
                            <Label className="text-sm font-medium">
                              Filter By
                            </Label>

                            {/* Name Filter */}
                            <div className="space-y-1">
                              <Label className="text-xs">Employee Name</Label>
                              <Input
                                type="text"
                                value={filters.name}
                                onChange={(e) => handleFilterChange("name", e.target.value)}
                                placeholder="Search by name"
                                className="w-full border rounded-md px-2 py-1 text-sm outline-none"
                              />
                            </div>
                            <Select.Root open={filter} onOpenChange={setFilter} value={filters.status} onValueChange={(value) => handleFilterChange("status", value)} >
                              <Select.Trigger asChild>
                                <Button variant="outline" className="w-full text-xs">
                                  <span>
                                    {filters.status || "Select Status"}
                                  </span>

                                  <ChevronDown className={`w-4 h-4 opacity-50 ${filter && "rotate-180"}`} />
                                </Button>

                              </Select.Trigger>

                              <Select.Content position='popper' sideOffset={4} className="bg-card border rounded shadow p-2 z-50 data-open:animate-in data-[state=open]: animate-in data-[state=closed]: zoom-out-95 data-[state=open]: zoom-in-95">
                                <Select.Group>
                                  <Select.Item value="all" className='px-2 py-1 text-xs cursor-pointer hover:bg-muted focus:bg-muted text-foreground '>All</Select.Item>
                                  <Select.Item value="P" className='px-2 py-1 text-xs cursor-pointer hover:bg-muted focus:bg-muted text-foreground '>Present</Select.Item>
                                  <Select.Item value="A" className='px-2 py-1 text-xs cursor-pointer hover:bg-muted focus:bg-muted text-foreground '>Absent</Select.Item>
                                  <Select.Item value="Late" className='px-2 py-1 text-xs cursor-pointer hover:bg-muted focus:bg-muted text-foreground '>Late</Select.Item>
                                  <Select.Item value="WO" className='px-2 py-1 text-xs cursor-pointer hover:bg-muted focus:bg-muted text-foreground '>Week Off</Select.Item>
                                </Select.Group>
                              </Select.Content>
                            </Select.Root>

                            {/* Date Filter */}
                            <div className="space-y-1">
                              <Label className="text-xs">Date</Label>
                              <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => handleFilterChange("date", e.target.value)}
                                className="w-full border rounded-md px-2 py-1 text-sm outline-none"
                              />
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-2 pt-2">
                              <Button variant="secondary" className="cursor-pointer text-xs"
                                onClick={handleApplyFilter}
                              >
                                Apply
                              </Button>

                              <Button
                                variant="secondary"
                                className="cursor-pointer text-xs"
                                onClick={handleClearFilter}
                              >
                                Clear
                              </Button>
                            </div>
                          </div>
                        </Select.Content>
                      </Select.Root>

                      {/* <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1 ">
                        <LogIn className="w-4 h-4  rotate-90  " />
                        Attedance Export
                      </Button>

                      <Button variant="outline" className="text-xs cursor-pointer items-center justify-center  px-2 py-1 ">
                        <LogIn className="w-4 h-4 rotate-270  " />
                        Import
                      </Button>

                      <Button className="text-xs cursor-pointer items-center justify-center  px-2 py-1 " variant="outline">
                        <FileText className="w-4 h-4" />
                        Template
                      </Button> */}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          {/* tabs contenct 1 */}
          <Tabs.Content value="tab2" className=" ">
            <Card>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 gap-3 p-3">

                  {/* cards total present  */}
                  <div className="flex flex-col border rounded-lg p-3 gap-1 hover:shadow-md transition ">
                    <CardTitle className="text-sm font-medium">Total Present</CardTitle>
                    <CardDescription className="text-sm text-foreground ">{totalPresent}</CardDescription>
                    <CardDescription>{totalPresentPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards total absent */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2hover:shadow-md transition p-2 hover:shadow-md ">
                    <CardTitle className="text-sm font-medium">Total Absent</CardTitle>
                    <CardDescription className="text-xs text-foreground ">{totalAbsent}</CardDescription>
                    <CardDescription>{totalAbsentPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards late arrival */}
                  <div className="flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition ">
                    <CardTitle className="text-sm font-medium">Late Arrivals </CardTitle>
                    <CardDescription className="text-xs text-foreground ">{totalLateArrivals}</CardDescription>
                    <CardDescription>{totalLateArrivalsPercentage}% of total days</CardDescription>
                  </div>

                  {/* cards holidays */}
                  <div className='flex flex-col gap-1 border rounded-lg p-2 hover:shadow-md transition'>
                    <CardTitle className="text-sm font-medium">WeekOff</CardTitle>
                    <CardDescription className="text-xs text-foreground ">{totalWorkOff}</CardDescription>
                    <CardDescription>{totalWorkOffPercentage}% of total days</CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Tabs.Content>

          {/* tabs contenct 2 */}
          <div className='grid grid-cols-1 p-3 border rounded-lg w-full overflow-x-auto'>
            <Tabs.Content value="tab1" className="">

              {/* monthly attendance table  */}
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted text-xs">
                    <TableHead>#</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Emp Status</TableHead>

                    {days.map((item, index) => (
                      <TableHead key={index} className="text-xs">

                        <span className="flex text-xs flex-col">
                          {item.day} {item.label}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>

                {/* <TableBody>
                  {monthlyData.filter((item) => item.user).map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>

                      <TableCell>
                        {item.user?.employee?.firstName}{" "}
                        {item.user?.employee?.lastName}
                      </TableCell>

                      <TableCell>
                        {item.user?.employee?.department?.name}
                      </TableCell>

                      <TableCell>  {item.user?.employee?.isActive ? "Active" : "Inactive"}</TableCell>

                      {currentData.map((dayItem) => (
                        <TableCell
                          key={dayItem.date}
                          className={`text-center rounded-xl ${dayItem.status === "P" ? "bg-green-100" : dayItem.status === "WO"
                            ? "bg-gray-200"
                            : "bg-red-100"
                            }
                           `}
                        >
                          {dayItem.status}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody> */}

                <TableBody className='bg-card'>
                  {employees.map((emp, index) => (
                    <TableRow key={emp.id}>

                      {/* row number */}
                      <TableCell>{index + 1}</TableCell>

                      {/* name */}
                      <TableCell>
                        {emp.firstName} {emp.lastName}
                      </TableCell>

                      {/* department */}
                      <TableCell>{emp.department?.name}</TableCell>

                      {/* status */}
                      <TableCell>
                        {emp.isActive ? "Active" : "Inactive"}
                      </TableCell>

                      {/* DAYS LOOP (IMPORTANT FIX) */}
                      {days.map((day, i) => {
                        const finalStatus = getFinalStatus(emp.id, day);

                        return (
                          <TableCell
                            key={i}
                            className={` text-center rounded-full text-xs py-0 px-2  ${getStatusColor(finalStatus)}`}
                          >
                            {finalStatus === "-" ? "" : finalStatus}
                          </TableCell>
                        );
                      })}

                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* pagination */}
              <div className="flex  items-center justify-between mt-4 px-2 " >
                <p className="text-xs text-muted-foreground">
                  Showing {startIndex + 1} - {Math.min(startIndex + rowperPage, currentData.length)} of {uniqueEmployees.length} employees
                </p>

                <div className='ml-auto'>
                  <Pagination>
                    <PaginationContent >

                      {/* previous */}
                      <PaginationPrevious
                        href='#'
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      />
                      {/* pages number */}
                      {Array.from({ length: totalPage }).map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            href='#'
                            isActive={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {/* next */}
                      <PaginationItem>
                        <PaginationNext
                          href='#'
                          onClick={(e) => {
                            e.preventDefault()
                            setCurrentPage(prev => Math.min(prev + 1, totalPage))
                          }}
                        />

                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </div>

            </Tabs.Content>
          </div>
        </Tabs.Root>
        {/* <AppSidebar /> */}
      </main>
      {/* </SidebarProvider> */}
    </div>
  )
}

export default MonthlyAttendance
