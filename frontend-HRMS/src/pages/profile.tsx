import React, { useEffect } from 'react'
import { getprofile } from '@/controllers/profile.controller';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';


function Profile() {

    const [user, setUser] = React.useState({
        name: "",
        email: "",
        avatar: "",
        createdAt: "",
        lastLogin: "",

    });


    useEffect(() => {

        const getProfile = async () => {
            try {
                const res = await getprofile();
                setUser(res.data);
                console.log(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        getProfile();
    }, [])

    const getInitials = (name: string) => {
        const names = name.trim().split(" ");
        if (names.length > 1) {
            return names[0][0] + names[1][0];
        }
        return names[0][0];
    }

    return (
        <SidebarProvider>
            <AppSidebar />

            <main className="flex-1 p-3">
                <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
                    <SidebarTrigger />
                </div>
                <h1 className='text-2xl font-bold mb-6'>Profile</h1>
                <div className='flex justify-center '>
                    <Card className='max-w-md w-full'>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                        </CardHeader>
                        <CardContent className='grid gap-4'>

                            <Avatar className='mx-auto h-20 w-20'>
                                <AvatarImage src={user.avatar} alt="avatar" />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>

                            {user && (
                                <div className='flex flex-col gap-2'>
                                    <p className='text-sm text-muted-foreground'>Name:</p>
                                    <Input type='text' defaultValue={user.name} />
                                    <p className='text-sm text-muted-foreground'>Email:</p>
                                    <Input type='email' defaultValue={user.email} />
                                    <p className='text-sm text-muted-foreground'>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                                    <p className='text-sm text-muted-foreground'>Last Login: {new Date(user.lastLogin).toLocaleString()}</p>
                                </div>
                            )}

                        </CardContent>
                    </Card>
                </div>

            </main>
        </SidebarProvider>
    )
}

export default Profile
