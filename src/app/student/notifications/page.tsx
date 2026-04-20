import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { notifications } from '@/lib/data';
import { format } from 'date-fns';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">
          Important announcements and updates from your lecturers and admins.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.sort((a, b) => b.date.getTime() - a.date.getTime()).map((notification) => (
            <Card key={notification.id}>
                <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                    <Avatar>
                        <AvatarFallback>{notification.author.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <CardTitle>{notification.title}</CardTitle>
                        <CardDescription>From: {notification.author}</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        {notification.content}
                    </p>
                </CardContent>
                <CardFooter>
                     <p className="text-xs text-muted-foreground">
                        Posted on {format(notification.date, 'PPP')}
                    </p>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
