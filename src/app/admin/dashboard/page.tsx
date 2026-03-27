'use client';

import { useState } from 'react';
import { BarChart3, GraduationCap, MoreHorizontal, Pencil, PlusCircle, Trash2, Users as UsersIcon } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { users as initialUsers, courses, getCurrentUser } from "@/lib/data";
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
import { Badge } from "@/components/ui/badge";
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

export default function AdminDashboardPage() {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();
  const currentUser = getCurrentUser("admin");

  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalStudents = users.filter(u => u.role === "student").length;
  const totalLecturers = users.filter(u => u.role === "lecturer").length;

  const handleSaveUser = (userData: Omit<User, 'id' | 'avatarUrl'> & { id?: string }) => {
    if (userData.id) {
      // Edit existing user
      setUsers(users.map(u => u.id === userData.id ? { ...u, ...userData } : u));
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
      setUsers([...users, newUser]);
      toast({
        title: "User Added",
        description: `${newUser.name} has been added to the system.`,
      });
    }
    setIsFormOpen(false);
    setUserToEdit(null);
  };

  const handleDeleteUser = () => {
    if (!userToDelete) return;

    setUsers(users.filter(user => user.id !== userToDelete.id));
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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Stats Cards */}
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
        <StatsCard
          title="Active Sessions"
          value="128"
          description="Users currently online"
          icon={<BarChart3 className="h-4 w-4" />}
        />
         <StatsCard
          title="Submissions Today"
          value="72"
          description="+15% from yesterday"
          icon={<UsersIcon className="h-4 w-4" />}
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
                  <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : user.role === 'lecturer' ? 'secondary' : 'default'}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                     <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          aria-haspopup="true"
                          size="icon"
                          variant="ghost"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onSelect={() => handleOpenForm(user)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => setUserToDelete(user)}
                          className="text-destructive"
                          disabled={user.id === currentUser.id}
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
