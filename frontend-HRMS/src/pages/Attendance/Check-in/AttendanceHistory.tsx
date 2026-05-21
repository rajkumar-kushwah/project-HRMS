// import { AppSidebar } from "@/components/app-sidebar";
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect } from "react";
import { getAttendance } from "@/controllers/checkIn.controller";
import { useNavigate } from "react-router-dom";
import { filterAttendance, deleteAttendance } from "@/controllers/checkIn.controller";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldGroup, FieldLabel } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { Select } from "radix-ui";
import { useAuth } from "@/pages/context/AuthContext";

interface Attendance {
    id: number;
    user: {
        name: string;
    };
    date: string;
    checkIn: string;
    checkOut: string;
    totalMinutes: number;
    overtimeMinutes: number;
    status: string;
}

interface AttendanceFilterParams {
    search?: string;
    date?: string;
    status?: string;
}


function AttendanceHistory() {
    const navigate = useNavigate();
    const { user } = useAuth();
  
    const [attendanceData, setAttendanceData] = React.useState<Attendance[]>([]);
    const [seachItem, setSearchItem] = React.useState<AttendanceFilterParams>({});
    const [open, setOpen] = React.useState(false);
    const [selectIds, setSelectIds] = React.useState<number[]>([]);

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
            if (!seachItem.search && !seachItem.date && !seachItem.status) return;
            if (seachItem) {
                const res = await filterAttendance({ ...seachItem });
                setAttendanceData(res.data.data || res.data || []);
            } else {
                const res = await getAttendance();
                setAttendanceData(res.data.data || res.data || []);

            }
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    // clear filter
    const handleClearFilter = async () => {
        try {
            setSearchItem({ search: "", date: "", status: "" });

            const res = await getAttendance();
            setAttendanceData(res.data.data || res.data || []);
            setOpen(false);
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

    const formatDuration = (minutes: number) => {
        if (!minutes) return "-";

        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;

        return `${hours}h ${mins}m`;
    };

    // single row select function
    const handleSelect = (id: number) => {
        setSelectIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    // select all function 
    const handleSelectAll = () => {
        if (selectIds.length === attendanceData.length) {
            setSelectIds([]);
        } else {
            setSelectIds(attendanceData.map((item) => item.id));
        }
    }

    const handleDelete = async () => {
        // please select a row
        if (selectIds.length === 0) {
            toast.error("Please select a row");
            return;
        }
        const confirmDelete = window.confirm(
            "Are you sure you want to delete selected attendance?"
        );

        if (!confirmDelete) {
            return;
        }
        try {
            await deleteAttendance(selectIds);
            toast.success("Deleted successfully");

            fetchAttendance();
            setSelectIds([]);
        } catch (error) {
            toast.error("Failed to delete");
            console.error(error);
        }
    }

    return (
        // <SidebarProvider>

        //     <AppSidebar />
        <div className="flex-1 p- h-screen">
            {/* <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
                    <SidebarTrigger />
                </div> */}
            <div>
                <Button className="text-xs cursor-pointer" variant="outline" onClick={() => navigate(-1)}>Back</Button>
            </div>


            <div className="">
                {/* Filter section */}
                <div className="flex gap-2 mb-4 justify-end items-center">
                    <h1 className="text-base font-medium">Filter Table</h1>

                    <Select.Root open={open} onOpenChange={setOpen}>
                        <Select.Trigger asChild >
                            <Button className=" cursor-pointer" variant="outline">Filter</Button>
                        </Select.Trigger>
                        <Select.Content position="popper" sideOffset={4}
                            className="bg-muted border rounded-lg shadow-md p-4  z-50 data-open:animate-in data-[state=open]: animate-in data-[state=closed]: zoom-out-95 data-[state=open]: zoom-in-95 "
                        >
                            <Label className="text-sm font-medium">
                                Filter By
                            </Label>
                            <div className="flex gap-2 mb-4">
                                <Input placeholder="Filter by name or date" type="text" value={seachItem.search || ""} onChange={(e) => setSearchItem({ ...seachItem, search: e.target.value })} />
                                <Input placeholder="Filter by name or date" type="date" value={seachItem.date || ""} onChange={(e) => setSearchItem({ ...seachItem, date: e.target.value })} />
                                <Button variant="outline" className=" cursor-pointer"
                                    onClick={handleApplyFilter}
                                >
                                    Apply
                                </Button>
                                <Button variant="ghost" className=" cursor-pointer" onClick={handleClearFilter}>Clear</Button>
                            </div>
                        </Select.Content>
                    </Select.Root>
                    <div>
                        {/* role based delete access */}
                        {user?.permission?.includes("CHECKIN.DELETE") && (
                            <Button className=" cursor-pointer" variant="outline" onClick={handleDelete}>Delete Attendance</Button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="bg-card p-6 grid grid-cols-1 rounded border w-full overflow-x-auto">
                    <div>
                        <Table>
                            <TableHeader className="bg-muted w-full rounded-lg ">
                                <TableRow>

                                    <TableHead>
                                        <div className="">
                                            <Label htmlFor="select-all" className="text-xs cursor-pointer whitespace-nowrap"> All</Label>
                                            <FieldGroup className="max-w-sm">
                                                <FieldLabel className="flex  text-xs items-center gap-1  text-muted-foreground">
                                                    <Checkbox id="select-all" name="terms-checkbox" checked={selectIds.length === attendanceData.length} onCheckedChange={handleSelectAll} />
                                                </FieldLabel>
                                            </FieldGroup>
                                        </div>
                                    </TableHead>

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
                                        <TableCell><Checkbox id="terms-checkbox" name="terms-checkbox" checked={selectIds.includes(item.id)} onCheckedChange={() => handleSelect(item.id)} /></TableCell>
                                        <TableCell>{item.user?.name}</TableCell>
                                        <TableCell>{formatDate(item.date)}</TableCell>
                                        <TableCell>{formatTime(item.checkIn)}</TableCell>
                                        <TableCell>{formatTime(item.checkOut)}</TableCell>
                                        <TableCell>{formatDuration(item.totalMinutes)}</TableCell>
                                        <TableCell>{formatDuration(item.overtimeMinutes)}</TableCell>
                                        <TableCell>{item.status}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            {/* </SidebarProvider> */}
        </div>
    );
}

export default AttendanceHistory