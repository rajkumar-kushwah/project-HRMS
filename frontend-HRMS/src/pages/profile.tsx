import React, { useEffect } from 'react'
import { getprofile } from '../services/auth.controller'
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

            <main>
                <SidebarTrigger />
                <h1>Profile</h1>
                <div className='p-6'>
                    <Card className='max-w-md'>
                        <CardHeader>
                            <CardTitle>Profile</CardTitle>
                        </CardHeader>
                        <CardContent className='grid grid-cols-1 items-center gap-4'>

                            <Avatar>
                                <AvatarImage src={user.avatar} alt="avatar" />
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                            </Avatar>

                            {user && (
                                <div>
                                    <p className='text-sm text-muted-foreground'>Name:</p>
                                    <Input type='text' defaultValue={user.name} />
                                    <p className='text-sm text-muted-foreground'>Email:</p>
                                    <Input type='email' defaultValue={user.email} />
                                    <p>Created At: {user.createdAt}</p>
                                    <p>Last Login: {user.lastLogin}</p>
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
