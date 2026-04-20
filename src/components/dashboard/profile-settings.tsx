'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { User } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';

const CURRENT_USER_STORAGE_KEY = 'study-spot-current-user';
const USERS_STORAGE_KEY = 'study-spot-users';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
});

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Please enter your current password.' }),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match.",
    path: ['confirmPassword'],
  });

export function ProfileSettings() {
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsMounted(true);
  }, []);

  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (currentUser) {
      profileForm.reset({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
  }, [currentUser, profileForm]);

  const handleAvatarChangeClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    if (!file.type.startsWith('image/')) {
        toast({
            title: 'Invalid File Type',
            description: 'Please select an image file.',
            variant: 'destructive',
        });
        return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
        const newAvatarUrl = reader.result as string;
        const updatedUser = { ...currentUser, avatarUrl: newAvatarUrl };
        
        setCurrentUser(updatedUser);
        localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));
        
        const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const updatedUsers = users.map((u: User) => u.id === updatedUser.id ? updatedUser : u);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

        toast({
          title: 'Avatar Updated',
          description: 'Your profile picture has been changed.',
        });
        // This is a hack to force the user nav to re-render with the new avatar
        window.dispatchEvent(new Event('storage'));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = (values: z.infer<typeof profileFormSchema>) => {
    if (!currentUser) return;
    setIsProfileSaving(true);

    // Simulate API call
    setTimeout(() => {
      const updatedUser = { ...currentUser, ...values };
      setCurrentUser(updatedUser);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(updatedUser));
      
      const usersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const updatedUsers = users.map((u: User) => u.id === updatedUser.id ? updatedUser : u);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(updatedUsers));

      toast({
        title: 'Profile Updated',
        description: 'Your profile information has been saved.',
      });
      setIsProfileSaving(false);
      // This is a hack to force the user nav to re-render with the new name/email
      window.dispatchEvent(new Event('storage'));
    }, 1000);
  };

  const handlePasswordSubmit = (values: z.infer<typeof passwordFormSchema>) => {
    setIsPasswordSaving(true);
    // Mock password change logic. In a real app, you'd verify the current password.
    console.log(values);
    setTimeout(() => {
        toast({
          title: 'Password Changed',
          description: 'Your password has been successfully updated.',
        });
        passwordForm.reset();
        setIsPasswordSaving(false);
    }, 1000)
  };

  if (!isMounted || !currentUser) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-20 w-20 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-10 w-32" />
                           <Skeleton className="h-4 w-48" />
                        </div>
                    </div>
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10 w-32" />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10" />
                    <Skeleton className="h-10 w-36" />
                </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your personal details and profile picture.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                  <AvatarImage src={currentUser.avatarUrl} alt={currentUser.name} />
                  <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button onClick={handleAvatarChangeClick}>Change Photo</Button>
                  <p className="text-sm text-muted-foreground mt-2">Upload a new profile picture.</p>
              </div>
          </div>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                    <Input value={currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)} readOnly disabled />
                </FormControl>
                <FormDescription>Your role cannot be changed.</FormDescription>
              </FormItem>
              <Button type="submit" disabled={isProfileSaving}>
                {isProfileSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your password. Make sure it's a strong one.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type={showCurrentPassword ? 'text' : 'password'} {...field} />
                            <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            >
                            {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <Input type={showNewPassword ? 'text' : 'password'} {...field} />
                            <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground"
                            >
                            {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPasswordSaving}>
                 {isPasswordSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
