import Link from "next/link";
import { BookOpen, GraduationCap, FileText, Megaphone, LayoutDashboard } from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo, LogoWithText } from "@/components/logo";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { getCurrentUser } from "@/lib/data";

const navItems = [
  { href: "/lecturer/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/lecturer/courses", icon: <GraduationCap />, label: "Courses" },
  { href: "#", icon: <FileText />, label: "Assignments" },
  { href: "#", icon: <BookOpen />, label: "Submissions" },
  { href: "#", icon: <Megaphone />, label: "Announcements" },
];

export default function LecturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = getCurrentUser("lecturer");

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="hidden md:block">
            <LogoWithText />
          </div>
          <div className="block md:hidden">
            <Logo />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.label}>
                <SidebarMenuButton asChild>
                  <Link href={item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <p className="text-xs text-muted-foreground p-2">© 2024 StudySpot</p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader user={user} title="Lecturer Portal" />
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
