import { courses, users } from "@/lib/data";
import { CourseCard } from "@/components/dashboard/course-card";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { format } from "date-fns";

const studentCourses = courses.slice(0, 2);
const upcomingAssignments = [
  { id: 1, title: "Physics Problem Set 1", course: "Introduction to Physics", dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
  { id: 2, title: "Art History Essay", course: "History of Modern Art", dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
];

export default function StudentDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
        <p className="text-muted-foreground">
          Continue your learning journey.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {studentCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight">Upcoming Deadlines</h2>
        <p className="text-muted-foreground">
          Stay on top of your assignments.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
          <CardDescription>Don&apos;t miss these due dates!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
             {upcomingAssignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between rounded-md border p-4">
                <div>
                  <p className="font-semibold">{assignment.title}</p>
                  <p className="text-sm text-muted-foreground">{assignment.course}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{format(assignment.dueDate, "MMM dd")}</p>
                  <p className="text-sm text-muted-foreground">{format(assignment.dueDate, "yyyy")}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
