
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AvatarImage, Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAuth } from './context/AuthContext';


function Profile() {
    const { user } = useAuth();


    const getInitials = (name: string = "") => {
        const names = name.trim().split(" ").filter(Boolean);

        const first = names[0]?.[0] || "";
        const last = names[1]?.[0] || "";

        return first + last;
    };

    return (
        // <SidebarProvider>
        //     <AppSidebar />
        <div>
            <main className="flex-1 p-3">
                {/* <div className=' sticky top-0 z-50 bg-white flex items-center gap-2 mb-4'>
                    <SidebarTrigger />
                </div> */}

                <div className='flex justify-center '>
                    <Card className='bg-card text-card-foreground border-border max-w-md w-full'>
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
                                    <p className='text-sm text-muted-foreground'>{"Role : " + user.roles}</p>
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
            {/* </SidebarProvider> */}
        </div>
    )
}

export default Profile
