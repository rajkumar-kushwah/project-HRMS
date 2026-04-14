import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { MoreVertical, Shield, UserCog } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
// import * as Select from "@radix-ui/react-select";
// import { ChevronDown, LucideX, LucideCheck } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { TableBody, Table, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenuContent, DropdownMenu, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

import { getRoles, createRole, updateRole, deleteRole } from '@/controllers/roleApi.controller'
import { getPermissions } from '@/controllers/permissionApi.controller'



interface Role {
    id: number;
    name: string;
    description: string;
    permissions: {
        id: number;
        name: string;
        category: string;
    }[];
}

function CreateHRRole() {

    const [tablepemissions, setTablePermissions] = React.useState(false);
    const [open, setOpen] = React.useState(false)
    const [editOpen, setEditOpen] = React.useState(false)
    const [editRole, setEditRole] = React.useState<number | null>(null);
    const [roleName, setRoleName] = React.useState("");
    const [roleDesc, setRoleDesc] = React.useState("");
    const [selectPermissions, setSelectPermissions] = React.useState<number[]>([]);
    const [roles, setRoles] = React.useState<Role[]>([]);
    const [permissionsList, setPermissionsList] = React.useState<any[]>([]);

    React.useEffect(() => {
        fetchData();
    }, [])

    const fetchData = async () => {
        try {
            const roleRes = await getRoles();
            const permRes = await getPermissions();
            setRoles(roleRes.data.data);
            setPermissionsList(permRes.data.data);
        } catch (error) {
            toast.error("Failed to fetch data");
        }
    }

    // clear form
    const resetForm = () => {
        setRoleName("");
        setRoleDesc("");
        setSelectPermissions([]);
        setOpen(false);
        setEditOpen(false);
        setEditRole(null);
    }

    // create role
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim() || !roleDesc.trim()) {
            toast.error("Role name, description, are required");
            return;
        }
        try {
            await createRole({
                name: roleName,
                description: roleDesc,
                permissions: selectPermissions
            });

            toast.success("Role created");

            //  clear form
            resetForm();
            fetchData();
            console.log(roleName, roleDesc, selectPermissions);
        } catch (error) {
            console.log(error);
            toast.error("Failed to create role");
        }
    }

    // update role
    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roleName.trim()) {
            toast.error("Role name required");
            return
        }
        if (editRole === null) return;
        console.log("UPDATE ID:", editRole);
        try {
            await updateRole(editRole, {
                name: roleName,
                description: roleDesc,
                permissions: selectPermissions
            });

            toast.success("Role updated");
            //  clear form
            resetForm();
            console.log(roleName, roleDesc, selectPermissions);
        } catch (error) {
            console.log(error);
            toast.error("Update failed");
        }
    }


    //  delte role 

    const handleDelete = async (id: number) => {
        window.confirm("Are you sure you want to delete this role?");
        try {
            await deleteRole(id);
            //  permission delete

            toast.success("Role deleted");
            fetchData();
        } catch (error) {
            console.log(error);
            toast.error("Delete failed");
        }
    }

    // select permission descrptions
    const handleSelectPermission = (id: number) => {
        if (selectPermissions.includes(id)) {
            setSelectPermissions(selectPermissions.filter(p => p !== id))
        } else {
            setSelectPermissions([...selectPermissions, id])
        }
    }


    const groupedPermissions = permissionsList.reduce((acc, perm) => {
        const module = perm.category; // ATTENDANCE

        if (!acc[module]) {
            acc[module] = [];
        }

        acc[module].push(perm); // VIEW, EDIT, DELETE

        return acc;
    }, {});

    // console.log("permissionsList:", permissionsList);
    // console.log("groupedPermissions:", groupedPermissions);
    // console.log("selectPermissions:", selectPermissions);


    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='flex-1 p-3  '>
                <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
                    <SidebarTrigger />
                </div>
                <div className="mb-6">
                    <div className=' flex flex-wrap gap-2 shadow rounded-2xl justify-between  items-center  bg-white p-6'>
                        <div className='flex gap-2 items-center'>
                            <div className='shadow w-10 h-10 flex items-center justify-center rounded-lg'>
                                <Shield className='' />
                            </div>
                            <div>
                                <h1 className="text-2xl font-semibold">Create HR Role</h1>
                                <p className="text-sm text-gray-500">
                                    Assign HR management privileges to an employee
                                </p>
                            </div>
                        </div>

                        <div>
                            <Dialog open={open} onOpenChange={setOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className=' cursor-pointer'><UserCog className='w-2 h-2' /> Create Role</Button>
                                </DialogTrigger>
                                <DialogContent className=''>
                                    <DialogHeader>

                                        <DialogTitle>Create HR Role</DialogTitle>
                                        <DialogDescription>
                                            Assign HR management privileges to an employee
                                        </DialogDescription>

                                    </DialogHeader>
                                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 '>
                                        <div className='grid grid-cols-1 gap-2 '>
                                            <div>
                                                {/* <Label>Role Name</Label> */}
                                                <Input placeholder="Role Name" onChange={(e) => setRoleName(e.target.value)} />
                                            </div>
                                            <div>
                                                {/* <Label>Role Description</Label> */}
                                                <Input placeholder="Role Description" onChange={(e) => setRoleDesc(e.target.value)} />
                                            </div>
                                        </div>

                                        <Button type='submit' variant="outline" className='w-full cursor-pointer' >Create Role</Button>
                                    </form>
                                    <div>
                                        <h3>Assign Permissions</h3>
                                        {/* <div className='grid grid-cols-2'>
                                            {permissionsList.map((perm) => (
                                                <Label key={perm.id}>
                                                    <Input type='checkbox' checked={selectPermissions.includes(perm.id)}
                                                        onChange={() => handleSelectPermission(perm.id)}
                                                        className="mt-1 w-4 h-4"
                                                    />
                                                    <span className='text-xs'>{perm.name}</span>
                                                </Label>
                                            ))}
                                        </div> */}

                                        <div className='grid grid-cols-2'>
                                            {Object.keys(groupedPermissions).map((category) => (
                                                <div key={category} className="mb-2">
                                                    <h3 className="font-bold text-xs">
                                                        {category}
                                                    </h3>
                                                    <div className="pl-4">
                                                        {groupedPermissions[category].map((perm: any) => (
                                                            <Label key={perm.id} className="flex gap-2">
                                                                <input type="checkbox" checked={selectPermissions.includes(perm.id)}
                                                                    onChange={() => handleSelectPermission(perm.id)}
                                                                    className='' />
                                                                <span className='text-xs'>{perm.name}</span>
                                                            </Label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>


                                    </div>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </div>
                </div>
                <div className='mb-6 '>
                    <div className='grid grid-cols-1 p-3  border rounded-lg w-full overflow-x-auto'>
                        <h2 className="text-lg font-semibold mb-2">Roles List</h2>
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-gray-100'>
                                    <TableHead className="w-25">Role Name</TableHead>
                                    <TableHead className="w-25">Description</TableHead>
                                    <TableHead className="w-25">Permissions</TableHead>
                                    <TableHead className="w-25">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            {/* // table body */}

                            <TableBody >
                                {roles.map((role) => (
                                    <TableRow key={role.id}>
                                        <TableCell className="font-medium">{role.name}</TableCell>
                                        <TableCell>{role.description}</TableCell>
                                        {/* <TableCell className='gap-1'>
                                            {role.permissions.map((permission) => (
                                                <span key={permission.id} className="text-xs">
                                                    {permission ? ` ${permission.name},` : ''}
                                                </span>
                                            ))}
                                        </TableCell> */}
                                        <TableCell>
                                            {role.name !== 'SUPER_ADMIN' && (
                                                <Button size="sm" variant="outline" onClick={() => {
                                                    setPermissionsList(role.permissions);
                                                    setTablePermissions(true);
                                                }}>
                                                    View
                                                </Button>)}
                                        </TableCell>

                                        {/* dialog open button for permission table groups */}
                                        <Dialog open={tablepemissions} onOpenChange={setTablePermissions}>
                                            <DialogContent className='space-y-6 w-96'>

                                                <DialogHeader>
                                                    <DialogTitle>Permissions</DialogTitle>
                                                    <DialogDescription>
                                                        List of assigned permissions
                                                    </DialogDescription>
                                                </DialogHeader>

                                                {Object.entries(groupedPermissions).map(([category, permission]: any) => (
                                                    <div key={category}>
                                                        <h3 className='font-semibold'>{category}</h3>
                                                        {permission.map((p: any) => (
                                                            <p key={p.id} className='text-sm ml-2'>
                                                                {p.name}
                                                            </p>
                                                        ))}
                                                    </div>
                                                ))}

                                            </DialogContent>
                                        </Dialog>

                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild className="p-2 ">
                                                    {/* 3 dots */}
                                                    {role.name !== 'SUPER_ADMIN' && (
                                                        <Button variant="ghost" className="p-2">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>)}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuGroup>



                                                        {/* edite dialog */}
                                                        <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                                            <DialogTrigger asChild>

                                                                <DropdownMenuItem
                                                                    onSelect={(e) => {
                                                                        e.preventDefault();
                                                                        setEditRole(role.id);
                                                                        console.log("FULL ROLE:", role);
                                                                        console.log("ROLE PERMISSIONS:", role.permissions);
                                                                        setRoleName(role.name);
                                                                        setRoleDesc(role.description);
                                                                        // select id and name
                                                                        setSelectPermissions(role.permissions?.map(p => p.id) || []);
                                                                        // setSelectPermissions(extractPermissionIds(role.permissions));

                                                                        setEditOpen(true);
                                                                    }}
                                                                >Edit</DropdownMenuItem>
                                                            </DialogTrigger>
                                                            <DialogContent className=''>
                                                                <DialogHeader>

                                                                    <DialogTitle>Edit HR Role</DialogTitle>
                                                                    <DialogDescription>
                                                                        Assign HR management privileges to an employee
                                                                    </DialogDescription>

                                                                </DialogHeader>
                                                                <form onSubmit={handleUpdate} className='flex flex-col gap-4 '>
                                                                    <div className='grid grid-cols-1 gap-2 '>
                                                                        <div>
                                                                            {/* <Label>Role Name</Label> */}
                                                                            <Input placeholder="Role Name" value={roleName} onChange={(e) => setRoleName(e.target.value)} />
                                                                        </div>
                                                                        <div>
                                                                            {/* <Label>Role Description</Label> */}
                                                                            <Input placeholder="Role Description" value={roleDesc} onChange={(e) => setRoleDesc(e.target.value)} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='flex gap-2'>

                                                                        <Button type='submit' variant="outline" className='w-full cursor-pointer' >
                                                                            {editRole !== null ? "Update" : "Create"}
                                                                        </Button>
                                                                    </div>

                                                                    {/* Assign Permissions updated checkbox and name */}
                                                                    <div>
                                                                        <h1 className="font-bold">Assign Permissions Updated</h1>

                                                                        {Object.entries(groupedPermissions).map(([category, perms]: any) => (
                                                                            <div key={category} className="mb-3">

                                                                                <h2 className="font-bold text-xs">{category}</h2>

                                                                                <div className="grid grid-cols-2 gap-2">

                                                                                    {perms.map((perm: any) => (
                                                                                        <Label key={perm.id} className="flex items-center gap-2">

                                                                                            <Input
                                                                                                type="checkbox"
                                                                                                checked={selectPermissions.includes(perm.id)}

                                                                                                onChange={() => handleSelectPermission(perm.id)}
                                                                                                className="w-4 h-4 mt-1"
                                                                                            />

                                                                                            <span className='text-xs'>{perm.name}</span>

                                                                                        </Label>
                                                                                    ))}

                                                                                </div>

                                                                            </div>
                                                                        ))}

                                                                    </div>

                                                                </form>
                                                            </DialogContent>
                                                        </Dialog>



                                                        {role.name !== 'SUPER_ADMIN' && (
                                                            <DropdownMenuItem onClick={() => handleDelete(role.id)}>Delete</DropdownMenuItem>)}
                                                        {/* <DropdownMenuItem>View</DropdownMenuItem> */}
                                                    </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                            </DropdownMenu>

                                        </TableCell>

                                    </TableRow>
                                ))}
                                {roles.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className=" text-center">
                                            No results.
                                        </TableCell>
                                    </TableRow>
                                )}

                            </TableBody>
                        </Table>
                    </div>
                </div>

            </main>
        </SidebarProvider>
    )
}

export default CreateHRRole
