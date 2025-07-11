import { SidebarProvider } from "@/components/ui/sidebar";
import { Sidebar } from "lucide-react";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";
import { MobileTabBar } from "@/modules/dashboard/ui/components/mobile-tab-bar";

interface Props {
    children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <div className="h-screen w-full bg-muted rounded-4xl 2xl:flex">
                <DashboardSidebar />
                <main className="flex-1 flex flex-col w-full">
                    {children}
                </main>
                <MobileTabBar /> 
            </div>
        </SidebarProvider>
    )
}
export default Layout;