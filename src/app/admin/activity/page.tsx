'use client';

import { useState, useEffect } from 'react';
import { initialUsers } from '@/lib/data';
import type { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const USERS_STORAGE_KEY = 'study-spot-users';

// Mocking active status for demonstration
const userStatus: { [key: string]: { status: 'Online' | 'Offline'; lastSeen: string } } = {
  'user-1': { status: 'Online', lastSeen: 'now' },
  'user-2': { status: 'Offline', lastSeen: '2 hours ago' },
  'user-3': { status: 'Online', lastSeen: 'now' },
  'user-5': { status: 'Offline', lastSeen: 'yesterday' },
  'user-6': { status: 'Offline', lastSeen: '5 minutes ago' },
};

export default function PlatformActivityPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsersRaw) {
        setUsers(JSON.parse(storedUsersRaw));
      } else {
        setUsers(initialUsers);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
      }
    } catch (error) {
      console.error("Failed to load users from localStorage", error);
      setUsers(initialUsers);
    }
    setIsMounted(true);
  }, []);

  const activityUsers = users.filter(u => u.role === 'student' || u.role === 'lecturer');

  if (!isMounted) {
    return (
      <div className="space-y-6">
        <div>
            <h2 className="text-2xl font-bold tracking-tight">Platform Activity</h2>
            <p className="text-muted-foreground">
                Track the active status of students and lecturers.
            </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Platform Activity</h2>
        <p className="text-muted-foreground">
          Track the active status and details of students and lecturers.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Status</CardTitle>
          <CardDescription>
            A list of all students and lecturers and their current activity status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Seen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activityUsers.length > 0 ? (
                activityUsers.map((user) => {
                  const statusInfo = userStatus[user.id] || { status: 'Offline', lastSeen: 'N/A' };
                  return (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="hidden h-9 w-9 sm:flex">
                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="font-medium">{user.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="capitalize">{user.role}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusInfo.status === 'Online' ? 'success' : 'secondary'}>
                          {statusInfo.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{statusInfo.lastSeen}</TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No users found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
