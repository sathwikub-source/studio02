import Link from 'next/link';
import { dashboardNotifications } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { FileText, FolderDown, BookOpen, Megaphone } from 'lucide-react';
import type { DashboardNotification } from '@/lib/types';

const notificationIcons: { [key in DashboardNotification['type']]: React.ReactNode } = {
  assignment: <FileText className="h-5 w-5 text-primary" />,
  material: <FolderDown className="h-5 w-5 text-success" />,
  exam: <BookOpen className="h-5 w-5 text-destructive" />,
  announcement: <Megaphone className="h-5 w-5 text-accent" />,
};


export default function StudentDashboardPage() {
  const sortedNotifications = dashboardNotifications.sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Your recent notifications and updates.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Here are your latest updates.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {sortedNotifications.length > 0 ? (
                sortedNotifications.map((notification) => (
                    <Link href={notification.link} key={notification.id} className="block rounded-lg p-3 transition-colors hover:bg-muted/50 -m-3">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 pt-0.5">
                                {notificationIcons[notification.type]}
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm text-muted-foreground">{notification.description}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDistanceToNow(notification.date, { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))
             ) : (
                <div className="text-center py-10 text-muted-foreground">
                    You have no new notifications.
                </div>
             )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
