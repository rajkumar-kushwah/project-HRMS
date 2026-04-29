import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { getAttendance } from "@/controllers/checkIn.controller";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { filterAttendance } from "@/controllers/checkIn.controller";

interface Attendance {
    id: number;
    user: {
        name: string;
    };
    date: string;
    checkIn: string;
    checkOut: string;
    totalHours: string;
    overtime: number;
    status: string;
}



function AttendanceHistory() {
    const navigate = useNavigate();

    const [attendanceData, setAttendanceData] = React.useState<Attendance[]>([]);
    const [seachItem, setSearchItem] = React.useState("");

    const fetchAttendance = async () => {
        try {
            const res = await getAttendance();
            setAttendanceData(res.data.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    useEffect(() => {
        fetchAttendance();
    }, []);

    // Filter handler apply
    const handleApplyFilter = async () => {
        try {
            if (!seachItem.trim()) return;
            if (seachItem) {
                const res = await filterAttendance({ search: seachItem });  
                setAttendanceData(res.data.data || res.data || []);              
            } else {
                const res = await getAttendance();
                setAttendanceData(res.data.data || res.data || []);

            }
        } catch (error) {
            console.error(error);
        }
    }

    // clear filter
    const handleClearFilter = async () => {
        try {
            setSearchItem("");
            const res = await getAttendance();
            setAttendanceData(res.data.data || res.data || []);
        } catch (error) {
            console.error(error);
        }
    }

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



    return (
        <SidebarProvider>

            <AppSidebar />
            <main className="flex-1 p-3">
                <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
                    <SidebarTrigger />
                </div>
                <div>
                    <Button className="text-xs cursor-pointer" variant="outline" onClick={() => navigate(-1)}>Back</Button>
                </div>
                <div className="p-1">
                    <h1 className="text-xl font-semibold mb-4">
                        Attendance History
                    </h1>

                    {/* Filter section */}

                    <div className="flex gap-2 mb-4">
                        <Input placeholder="Filter by name or date" type="text" value={seachItem} onChange={(e)=> setSearchItem(e.target.value)}/>
                        <Button variant="outline" className=" cursor-pointer"
                        onClick={handleApplyFilter}
                        >
                            Apply
                        </Button>
                        <Button variant="ghost" className=" cursor-pointer" onClick={handleClearFilter}>Clear</Button>
                    </div>

                    {/* Table */}
                    <div className="bg-white p-6 grid grid-cols-1 rounded border w-full overflow-x-auto">
                        <div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Check In</TableHead>
                                        <TableHead>Check Out</TableHead>
                                        <TableHead>Total Hours</TableHead>
                                        <TableHead>Over Time</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {attendanceData.map((item) => (
                                        <TableRow key={item.id}>
                                            <TableCell>{item.user?.name}</TableCell>
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
                    </div>
                </div>
            </main>


        </SidebarProvider>
    );
}

export default AttendanceHistory