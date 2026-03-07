import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>
            <AppSidebar />

            <main>
                <SidebarTrigger className="-ml-1" />
               <h1 className="text-base font-medium">Dashboard</h1>
                {children}
            </main>

        </SidebarProvider>
    )
}

