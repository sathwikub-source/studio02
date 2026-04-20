'use client';

import { useState, useEffect } from 'react';
import { initialUsers, notifications as initialNotifications } from '@/lib/data';
import type { Notification, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { AnnouncementFormDialog } from '@/components/dashboard/announcement-form-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const NOTIFICATIONS_STORAGE_KEY = 'study-spot-notifications';
const CURRENT_USER_STORAGE_KEY = 'study-spot-current-user';

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

export default function AdminAnnouncementsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [notificationToDelete, setNotificationToDelete] = useState<Notification | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const { toast } = useToast();

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

      const currentUserRaw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if(currentUserRaw) {
        setCurrentUser(JSON.parse(currentUserRaw));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setNotifications(initialNotifications);
    }
  }, []);

  const updateNotificationsInStateAndStorage = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    try {
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(newNotifications));
    } catch (error) {
      console.error("Failed to save notifications to localStorage", error);
    }
  };

  const handleSaveAnnouncement = (data: { title: string; content: string }) => {
    if (!currentUser) return;
    const newNotification: Notification = {
      id: `notif-${Date.now()}`,
      author: currentUser.name,
      title: data.title,
      content: data.content,
      date: new Date(),
    };
    const newNotifications = [newNotification, ...notifications];
    updateNotificationsInStateAndStorage(newNotifications);
    toast({
      title: "Announcement Posted",
      description: "Your announcement has been published.",
    });
  };

  const handleDeleteAnnouncement = () => {
    if (!notificationToDelete) return;
    const newNotifications = notifications.filter(n => n.id !== notificationToDelete.id);
    updateNotificationsInStateAndStorage(newNotifications);
    toast({
      title: "Announcement Deleted",
      description: "The announcement has been removed.",
      variant: "destructive",
    });
    setNotificationToDelete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Announcements</h2>
          <p className="text-muted-foreground">
            Create, manage, and view platform-wide announcements.
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Announcement
        </Button>
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
                        <div className="grid gap-1 flex-1">
                            <CardTitle>{notification.title}</CardTitle>
                            <CardDescription>From: {notification.author}</CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="capitalize">{authorDetails.role}</Badge>
                            <Button variant="ghost" size="icon" onClick={() => setNotificationToDelete(notification)}>
                                <Trash2 className="h-4 w-4 text-destructive" />
                                <span className="sr-only">Delete</span>
                            </Button>
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

      <AnnouncementFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveAnnouncement}
      />

      <AlertDialog open={!!notificationToDelete} onOpenChange={(open) => !open && setNotificationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the announcement titled "<span className="font-semibold">{notificationToDelete?.title}</span>".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setNotificationToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAnnouncement} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
