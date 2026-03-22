import { SidebarTrigger } from "@/components/ui/sidebar";
import type { User } from "@/lib/types";
import { UserNav } from "@/components/dashboard/user-nav";

interface DashboardHeaderProps {
  user: User;
  title: string;
}

export function DashboardHeader({ user, title }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SidebarTrigger className="sm:hidden" />
       <div className="flex-1">
         <h1 className="text-lg font-semibold md:text-2xl font-headline">{title}</h1>
       </div>
       <div className="flex items-center gap-4">
         <UserNav user={user} />
       </div>
    </header>
  );
}
