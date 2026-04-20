"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Calendar,
  Clock,
  Command,
  Frame,
  GalleryVerticalEnd,
  Icon,
  icons,
  Map,
  PieChart,
  Settings2,
  Shield,
  SquareTerminal,
  UserCheck,
  Users,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { getprofile } from "@/controllers/profile.controller"



// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Overview",
      url: "",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Profile",
          url: "/profile",
        },
        // {
        //   title: "Settings",
        //   url: "#",
        // },
      ],
    },
    {
      title: "employees Management",
      url: "#",
      icon: Users,
      items: [
        {
          title: "Department",
          url: "/department",
        },
        {
          title: "Register Employee",
          url: "/employees",
          icon: UserCheck,
        },
        {
          title: "Create HR Role",
          url: "/role",
          icon: Shield,
          permission: "create-role"
        },
      ],
    },
    {
      title: "Attendance",
      url: "#",
      icon: Users,
      items: [
        {
          title: "check-in/Out",
          url: "/check-in",
          icon: Clock
        },
        {
          title: "Mothly Attendance",
          url: "/monthly-attendance",
          icon: Calendar,
        },
        // {
        //   title: "Tutorials",
        //   url: "#",
        // },
        // {
        //   title: "Changelog",
        //   url: "#",
        // },
      ],
    },
    //   {
    //     title: "Settings",
    //     url: "#",
    //     icon: Settings2,
    //     items: [
    //       {
    //         title: "Account",
    //         url: "#",
    //       },
    //       {
    //         title: "Plans",
    //         url: "#",
    //       },
    //       {
    //         title: "Billing",
    //         url: "#",
    //       },
    //       {
    //         title: "Limits",
    //         url: "#",
    //       },
    //     ],
    // },
  ],
  // projects: [
  //   {
  //     name: "Design Engineering",
  //     url: "#",
  //     icon: Frame,
  //   },
  //   {
  //     name: "Sales & Marketing",
  //     url: "#",
  //     icon: PieChart,
  //   },
  //   {
  //     name: "Travel",
  //     url: "#",
  //     icon: Map,
  //   },
  // ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    avatar: "",
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getprofile()
        setUser(res.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProfile()
  }, [])
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
