import React, { useEffect } from 'react'
import { getprofile } from '../services/auth.controller'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import  { AppSidebar } from '@/components/app-sidebar';



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

    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarTrigger />

            
            <h1>Profile</h1>
            {user && (
                <div>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Created At: {user.createdAt}</p>
                    <p>Last Login: {user.lastLogin}</p>
                </div>
            )}
            
              
        </SidebarProvider>
    )
}

export default Profile
