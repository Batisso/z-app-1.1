"use client";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { usePathname } from "next/navigation";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { HomeIcon, Compass, UsersRound, AtomIcon, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardUserButton } from "@/modules/dashboard/ui/components/dashboard-user-button";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


const firstSection = [
    {
        icon: HomeIcon,
        label: "Home",
        href: "/",
    },
    {
        icon: Compass,
        label: "Discover",
        href: "/discover",
    },
    {
        icon: UsersRound,
        label: "Community",
        href: "/community",
    },
    {
        icon: AtomIcon,
        label: "AI",
        href: "/ai",
    },

    {
        icon: ShoppingCart,
        label: "Shop",
        href: "/shop",
    },
];


export const DashboardSidebar = () => {
    const { theme } = useTheme();

    const pathname = usePathname();

    const [logoHover, setLogoHover] = useState(false);
    return (
        <Sidebar className="hidden md:hidden lg:flex w-16 min-w-[6rem] max-w-[6rem] rounded-l-2xl rounded-r-2xl overflow-hidden m-2 flex-col">
            <SidebarHeader className="flex justify-center py-4">
                <Link
                    href="/"
                    className="flex flex-col items-center"
                    onMouseEnter={() => setLogoHover(true)}
                    onMouseLeave={() => setLogoHover(false)}
                >
                    <span
                        className={`transition-all duration-700 ease-in-out p-2 rounded-xl
                            ${logoHover ? "bg-muted shadow-lg scale-105" : ""}
                        `}
                    >
                        <span
                            className={`inline-block transition-all duration-500 ease-in-out ${logoHover ? "scale-110 opacity-80" : "scale-100 opacity-100"
                                }`}
                        >
                            <Image
                                src={logoHover ? "/Logo.svg" : "/Logo2.svg"}
                                alt="Zadulis Logo"
                                width={38}
                                height={38}
                            />

                            

                    
                        </span>
                    </span>
                </Link>
            </SidebarHeader>

            <div className="flex-1 flex flex-col items-center">
                <SidebarContent className="w-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-y-1">
                                <TooltipProvider>
                                    {firstSection.map((item) => (
                                        <SidebarMenuItem key={item.href}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <SidebarMenuButton
                                                        className={cn("group flex items-center w-full py-8 relative transition-all duration-300 ease-in-out hover:scale-110 hover:bg-muted hover:shadow-lg"
                                                            , pathname === item.href && "bg-linear-to-r/oklch border-[#ff8904] shadow-xl scale-110"
                                                        )}
                                                        isActive={pathname === item.href}
                                                    >
                                                        <Link href={item.href} className="flex items-center w-full justify-center">
                                                            <item.icon className="w-8 h-8 text-muted-foreground transition-colors duration-300 group-hover:text-primary" />
                                                            <span className={`absolute left-full ml-2 bg-muted px-15 py-10 rounded-2xl shadow-xl 
                                                                               font-black text-3xl whitespace-nowrap opacity-0 group-hover:opacity-100
                                                                              max-w-0 group-hover:max-w-[300px] transition-all duration-300 pointer-events-none z-50`}>
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" className="ml-2">
                                                    {item.label}
                                                </TooltipContent>
                                            </Tooltip>
                                        </SidebarMenuItem>
                                    ))}
                                </TooltipProvider>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <Separator className="my-4" />
                    
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu className="flex flex-col gap-y-2">
                                <SidebarContent className="flex justify-center py-4 mt-auto">
                                    <ThemeToggle />
                                </SidebarContent>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
            </div>
            <Separator className="my-4" />
            
          <SidebarFooter className="text-white -mt-2">
            <DashboardUserButton />
          </SidebarFooter>


        </Sidebar>
    );
}