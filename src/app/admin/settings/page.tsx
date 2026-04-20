'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProfileSettings } from '@/components/dashboard/profile-settings';

export default function AdminSettingsPage() {
  const [adminLimit, setAdminLimit] = useState(5);
  const { toast } = useToast();

  const handleSave = () => {
    // In a real app, you would save this setting to your backend.
    toast({
      title: 'Settings Saved',
      description: `Maximum number of admins set to ${adminLimit}.`,
    });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your profile, password, and platform-wide administrator settings.
        </p>
      </div>

      <ProfileSettings />

      <Card>
        <CardHeader>
          <CardTitle>Platform Settings</CardTitle>
          <CardDescription>Control administrator registration on the platform.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="admin-limit">Maximum Number of Admins</Label>
            <Input 
              id="admin-limit" 
              type="number" 
              value={adminLimit}
              onChange={(e) => setAdminLimit(Number(e.target.value))}
              className="max-w-xs"
            />
            <p className="text-sm text-muted-foreground">
              Set the maximum number of users that can have the admin role.
            </p>
          </div>
          <Button onClick={handleSave}>Save Platform Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
}
