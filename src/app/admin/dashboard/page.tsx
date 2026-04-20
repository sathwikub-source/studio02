'use client';

import { useState, useEffect } from 'react';
import { GraduationCap, MoreHorizontal, Pencil, PlusCircle, Trash2, Users as UsersIcon } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { initialUsers, courses } from "@/lib/data";
import type { User } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { UserFormDialog } from '@/components/dashboard/user-form-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';

const USERS_STORAGE_KEY = 'study-spot-users';
const CURRENT_USER_STORAGE_KEY = 'study-spot-current-user';

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // This can only run on the client
  useEffect(() => {
    try {
        const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        if (storedUsersRaw) {
            setUsers(JSON.parse(storedUsersRaw));
        } else {
            // If nothing in storage, use initial data and store it
            setUsers(initialUsers);
            localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initialUsers));
        }
        
        const currentUserRaw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
        if (currentUserRaw) {
            setCurrentUser(JSON.parse(currentUserRaw));
        }

    } catch (error) {
        console.error("Failed to load users from localStorage", error);
        setUsers(initialUsers); // Fallback to initial data
    }
    setIsMounted(true);
  }, []);

  const studentUsers = users.filter(u => u.role === 'student');
  const lecturerUsers = users.filter(u => u.role === 'lecturer');
  const adminUsers = users.filter(u => u.role === 'admin');

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalStudents = studentUsers.length;
  const totalLecturers = lecturerUsers.length;

  const updateUsersInStateAndStorage = (newUsers: User[]) => {
    setUsers(newUsers);
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers));
    } catch (error) {
      console.error("Failed to save users to localStorage", error);
      toast({
        title: "Error",
        description: "Could not save user changes.",
        variant: "destructive"
      });
    }
  };

  const handleSaveUser = (userData: Omit<User, 'id' | 'avatarUrl'> & { id?: string }) => {
    let newUsers;
    if (userData.id) {
      // Edit existing user
      newUsers = users.map(u => u.id === userData.id ? { ...u, ...userData } : u);
      toast({
        title: "User Updated",
        description: `${userData.name}'s details have been updated.`,
      });
    } else {
      // Add new user
      const newUser: User = {
        ...userData,
        id: `user-${Date.now()}`,
        avatarUrl: `https://i.pravatar.cc/150?u=user-${Date.now()}`,
      };
      newUsers = [...users, newUser];
      toast({
        title: "User Added",
        description: `${newUser.name} has been added to the system.`,
      });
    }
    updateUsersInStateAndStorage(newUsers);
    setIsFormOpen(false);
    setUserToEdit(null);
  };

  const handleDeleteUser = () => {
    if (!userToDelete || !currentUser) return;
    
    // Admin cannot delete themselves
    if (userToDelete.id === currentUser.id) {
        toast({
            title: "Action Forbidden",
            description: "You cannot delete your own account.",
            variant: "destructive"
        });
        setUserToDelete(null);
        return;
    }

    const newUsers = users.filter(user => user.id !== userToDelete.id);
    updateUsersInStateAndStorage(newUsers);
    toast({
      title: "User Deleted",
      description: `${userToDelete.name} has been removed from the system.`,
      variant: "destructive"
    });
    setUserToDelete(null);
  };
  
  const handleOpenForm = (user: User | null) => {
    setUserToEdit(user);
    setIsFormOpen(true);
  }

  if (!isMounted || !currentUser) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          description={`${totalStudents} students, ${totalLecturers} lecturers`}
          icon={<UsersIcon className="h-4 w-4" />}
        />
        <StatsCard
          title="Total Courses"
          value={totalCourses.toString()}
          description="Across all departments"
          icon={<GraduationCap className="h-4 w-4" />}
        />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Add, edit, or remove users from the platform.
            </CardDescription>
          </div>
          <Button onClick={() => handleOpenForm(null)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="students">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="lecturers">Lecturers</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
            </TabsList>
            <TabsContent value="students" className="pt-4">
              <UserTable users={studentUsers} onEdit={handleOpenForm} onDelete={setUserToDelete} />
            </TabsContent>
            <TabsContent value="lecturers" className="pt-4">
              <UserTable users={lecturerUsers} onEdit={handleOpenForm} onDelete={setUserToDelete} />
            </TabsContent>
             <TabsContent value="admins" className="pt-4">
              <UserTable users={adminUsers} onEdit={handleOpenForm} onDelete={setUserToDelete} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <UserFormDialog 
        user={userToEdit}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveUser}
      />

      <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for <span className="font-semibold">{userToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setUserToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteUser} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function UserTable({ users, onEdit, onDelete }: { users: User[], onEdit: (user: User) => void, onDelete: (user: User) => void }) {
  if (users.length === 0) {
    return <div className="text-center text-muted-foreground py-10">No users in this category.</div>
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
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
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onSelect={() => onEdit(user)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => onDelete(user)}
                    className="text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
