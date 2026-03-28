import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import DepartmentEdit from './DepartmentEdit'
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'sonner'
import { createDepartment, deleteDepartment, updateDepartment, getDepartments } from '@/controllers/department.controller'


function Department() {
    const [name, setName] = useState('');
    const [department, setDepartment] = useState<any[]>([]);
    const [open, setOpen] = useState(false);
    const [selectedDept, setSelectedDept] = useState<any>(null);
    const [openEdit, setOpenEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingAdd, setLoadingAdd] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            alert("Department name required");
            return;
        }

        setLoadingAdd(true);

        try {
            // Simulate loading
            await new Promise((res) => setTimeout(res, 1000));

            // Create department via Axios
            const res = await createDepartment(name);
            const newDepartment = res.data.department; // Axios -> data

            // 1 Update state
            const updatedList = [...department, newDepartment];
            setDepartment(updatedList);

            // 2 Update localStorage
            // localStorage.setItem('department', JSON.stringify(updatedList));

            toast.success('Department added successfully');
            // 3️ Reset input & close modal
            setName('');
            setOpen(false);

        } catch (error) {
            console.error(error);
            toast.error("Failed to add department");
        } finally {
            setLoadingAdd(false);
        }
    };

    // localstore ko load krna h
    // useEffect(() => {
    //     const data = JSON.parse(localStorage.getItem('department') || '[]');
    //     setDepartment(data);
    // }, [])

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getDepartments(); // API call
                // setDepartment(res.data);
                const data = res.data;
                setDepartment(data.departments || data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchDepartments();
    }, []);

    const handleUpate = async (updatedName: string) => {
        if (!selectedDept?.id) return toast.error("No department selected!");

        setLoading(true);
        try {
            const res = await updateDepartment(selectedDept.id, updatedName);
            const updatedDept = res.data.department;

            const updatedList = department.map((dep) =>
                dep.id === updatedDept.id ? updatedDept : dep
            );

            setDepartment(updatedList);

            toast.success("Department updated successfully");
            setOpenEdit(false);
        } catch (error) {
            toast.error("Failed to update department");
        } finally {
            setLoading(false);
        }
    };


    const handleDelete = async (id: number) => {
        // confirm delete
        const confirmDelete = window.confirm("Are you sure you want to delete this department?");
        if (!confirmDelete) return;
        try {
            const res = await deleteDepartment(id); // wait for API response
            console.log(res);
            const updatedList = department.filter((dep) => dep.id !== id);
            setDepartment(updatedList);
            toast.success("Department deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete department");
        }
    };


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className=' space-y-2  flex-1 p-6'>
                <SidebarTrigger />
                <div className='flex justify-between items-center'>
                    <h1 className="text-3xl  mb-6">Department</h1>


                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className=" cursor-pointer" variant="outline">Add Department</Button>
                        </DialogTrigger>
                        <DialogContent className="space-y-6 w-96">
                            <DialogHeader>
                                <DialogTitle className="text-2xl">Add Department</DialogTitle>
                                <DialogDescription>
                                    Fill the form to create a new department
                                </DialogDescription>
                            </DialogHeader>
                            <form className="space-y-4">
                                <div className='grid grid-cols-1 gap-3'>

                                    <Input placeholder="DepartmentName..." value={name} onChange={(e) => setName(e.target.value)} />


                                    <Button type="submit" className=' cursor-pointer' onClick={handleSubmit}>
                                        {loadingAdd && <Spinner />} Submit</Button>
                                </div>
                            </form>

                        </DialogContent>
                    </Dialog>

                </div>
                {/* 🔹 Search (header ke niche) */}
                <div className="mt-4">
                    <Input placeholder="Search..." className="max-w-sm" />
                </div>
                <div className="border rounded-lg overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-2 bg-gray-100 p-3 font-semibold">
                        <span>Department Name</span>
                        <span className="text-right">Actions</span>
                    </div>
                    {department.map((dep) => (
                        <div
                            key={dep.id}
                            className="p-3  border rounded mb-2 flex justify-between items-center">
                            <span >{dep.name}</span>
                            <div className="space-x-0 flex gap-2">
                                <Button size="sm" variant="outline" className=' cursor-pointer'
                                    onClick={() => {
                                        setSelectedDept(dep);
                                        setOpenEdit(true);

                                    }}>
                                    Edit

                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleDelete(dep.id)} className=' cursor-pointer'>Delete</Button>
                            </div>
                        </div>
                    ))}
                </div>

                {/*  sirf ek baar render karo */}
                <DepartmentEdit
                    open={openEdit}
                    setOpen={setOpenEdit}
                    selectedDept={selectedDept}
                    onUpdate={handleUpate}
                    loading={loading}
                />
            </main>
        </SidebarProvider>
    )
}

export default Department
