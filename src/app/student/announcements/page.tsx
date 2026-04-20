'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { notifications as initialNotifications, initialUsers } from '@/lib/data';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import type { Notification, User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const NOTIFICATIONS_STORAGE_KEY = 'study-spot-notifications';

const getAuthorDetails = (authorName: string, users: User[]): { role: string, avatarUrl?: string, fallback: string } => {
    if (authorName === 'Platform Admin') {
        const adminUser = users.find(u => u.role === 'admin');
        return { role: 'Admin', avatarUrl: adminUser?.avatarUrl, fallback: 'A' };
    }
    const user = users.find(u => u.name === authorName);
    if (user) {
        return { role: user.role, avatarUrl: user.avatarUrl, fallback: user.name.charAt(0) };
    }
    return { role: 'System', fallback: 'S' };
};

export default function AnnouncementsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedNotificationsRaw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      if (storedNotificationsRaw) {
        const storedNotifications = JSON.parse(storedNotificationsRaw).map((n: any) => ({
          ...n,
          date: new Date(n.date),
        }));
        setNotifications(storedNotifications);
      } else {
        setNotifications(initialNotifications);
        localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(initialNotifications));
      }
    } catch (error) {
      console.error("Failed to load notifications from localStorage", error);
      setNotifications(initialNotifications);
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
         <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
                <p className="text-muted-foreground">
                    Loading important announcements...
                </p>
            </div>
            <div className="space-y-4">
                {[1, 2].map(i => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="grid gap-1 flex-1">
                                <Skeleton className="h-6 w-1/2" />
                                <Skeleton className="h-4 w-1/4" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-3/4 mt-2" />
                        </CardContent>
                        <CardFooter>
                            <Skeleton className="h-4 w-1/3" />
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
  }

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
            const authorDetails = getAuthorDetails(notification.author, initialUsers);
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
            )
        })}
      </div>
    </div>
  );
}
