import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
  // User,
} from "lucide-react"


import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { deleteUser } from "../controllers/auth.controller"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { logout } from "@/controllers/auth.controller"
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/pages/context/ThemeContext";
import { useAuth } from "@/pages/context/AuthContext";

export function NavUser({

}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()

  const navigate = useNavigate()
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      // logout api call ke liye 
      const res = await logout();
      console.log(res);
      toast.success("Logout successful");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("logout failed");
    }
  };

  const getInitials = (name: string = "") => {
    const names = name.trim().split(" ").filter(Boolean);

    const first = names[0]?.[0]?.toUpperCase() || "";
    const last = names[1]?.[0]?.toUpperCase() || "";

    return first + last;
  };

  const handleDelete = async () => {
    // confirm delete krne ke user ko
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    // ager cancel kiya to yahi stop ho jayega
    if (!confirmDelete) return

    try {
      // user delete api call krne ke liye 
      const res = await deleteUser(user?.id);
      console.log(res.data.response);
      toast.success("User deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    }
  }

  const { dark, setDark } = useTheme();

  const handleThemeToggle = (
    e: React.MouseEvent<HTMLDivElement>
  ) => {

    const x = e.clientX;
    const y = e.clientY;

    const circle = document.createElement("div");

    circle.style.position = "fixed";
    circle.style.left = `${x}px`;
    circle.style.top = `${y}px`;

    circle.style.width = "20px";
    circle.style.height = "20px";

    circle.style.borderRadius = "9999px";

    circle.style.background =  dark ? "#fff" : "#000";
    circle.style.border = dark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(0,0,0,0.15)";

    circle.style.opacity = "1";
    circle.style.transform = "translate(-50%, -50%) scale(0)";

    circle.style.transition = "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1), opacity 1200ms ease";

    circle.style.zIndex = "9999";
    circle.style.pointerEvents = "none";

    document.body.appendChild(circle);

    // requestAnimationFrame is used to ensure that the animation is smooth
    requestAnimationFrame(() => {
      circle.style.transform =
        "translate(-50%, -50%) scale(90)";

      circle.style.opacity = "0";
    });

    setTimeout(() => {
      setDark(!dark);
    }, 350);

    setTimeout(() => {
      circle.remove();
    }, 1200);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                onClick={handleThemeToggle}
              // onClick={() => {
              //   console.log("before:", dark); setDark(!dark); console.log("after click");
              // }}
              >

                {dark ? <Sun /> : <Moon />}
                {dark ? "Light Mode" : "Dark Mode"}
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleDelete}>
                <BadgeCheck />
                Account Deleted
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
