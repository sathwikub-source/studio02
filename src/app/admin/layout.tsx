'use client';
import Link from "next/link";
import { Users, GraduationCap, BarChart3, LayoutDashboard, Settings, FileText, Megaphone, Award } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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
import type { User } from "@/lib/types";

const navItems = [
  { href: "/admin/dashboard", icon: <LayoutDashboard />, label: "Dashboard" },
  { href: "/admin/courses", icon: <GraduationCap />, label: "Manage Courses" },
  { href: "/admin/assignments", icon: <FileText />, label: "Assignments" },
  { href: "/admin/grades", icon: <Award />, label: "Manage Grades" },
  { href: "/admin/announcements", icon: <Megaphone />, label: "Announcements" },
  { href: "/admin/activity", icon: <BarChart3 />, label: "Platform Activity" },
  { href: "/admin/settings", icon: <Settings />, label: "Settings" },
];

const CURRENT_USER_STORAGE_KEY = 'study-spot-current-user';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUserRaw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (storedUserRaw) {
        const storedUser = JSON.parse(storedUserRaw);
        if (storedUser.role === 'admin') {
          setUser(storedUser);
        } else {
          // Wrong role, log them out
          localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
          router.push('/login');
        }
      } else {
        router.push('/login');
      }
    } catch (e) {
      // Something went wrong, log them out
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  if (isLoading || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }


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
        <DashboardHeader user={user} title="Admin Portal" />
        <main className="p-4 sm:px-6 sm:py-0">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
