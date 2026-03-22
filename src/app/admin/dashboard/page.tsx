import { BarChart3, GraduationCap, Users as UsersIcon } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { users, courses } from "@/lib/data";
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

export default function AdminDashboardPage() {
  const totalUsers = users.length;
  const totalCourses = courses.length;
  const totalStudents = users.filter(u => u.role === "student").length;
  const totalLecturers = users.filter(u => u.role === "lecturer").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            An overview of all users on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
