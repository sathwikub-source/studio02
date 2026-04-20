import { ProfileSettings } from '@/components/dashboard/profile-settings';

export default function LecturerSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>
      <ProfileSettings />
    </div>
  );
}
