
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { notifications, initialUsers } from '@/lib/data';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const getAuthorDetails = (authorName: string): { role: string, avatarUrl?: string, fallback: string } => {
    if (authorName === 'Platform Admin') {
        const adminUser = initialUsers.find(u => u.role === 'admin');
        return { role: 'Admin', avatarUrl: adminUser?.avatarUrl, fallback: 'A' };
    }
    const user = initialUsers.find(u => u.name === authorName);
    if (user) {
        return { role: user.role, avatarUrl: user.avatarUrl, fallback: user.name.charAt(0) };
    }
    return { role: 'System', fallback: 'S' };
};

export default function AnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
        <p className="text-muted-foreground">
          Important announcements and updates from your lecturers and admins.
        </p>
      </div>

      <div className="space-y-4">
        {notifications.sort((a, b) => b.date.getTime() - a.date.getTime()).map((notification) => {
            const authorDetails = getAuthorDetails(notification.author);
            
            return (
                <Card key={notification.id}>
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                        <Avatar>
                            <AvatarImage src={authorDetails.avatarUrl} alt={notification.author} />
                            <AvatarFallback>{authorDetails.fallback}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1">
                            <CardTitle>{notification.title}</CardTitle>
                            <CardDescription>From: {notification.author}</CardDescription>
                        </div>
                        <div className="ml-auto">
                            <Badge variant="secondary" className="capitalize">{authorDetails.role}</Badge>
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
            );
        })}
      </div>
    </div>
  );
}
