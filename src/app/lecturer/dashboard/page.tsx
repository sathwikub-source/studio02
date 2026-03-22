import { courses } from "@/lib/data";
import { CourseCard } from "@/components/dashboard/course-card";
import { DocumentSummaryTool } from "@/components/dashboard/document-summary-tool";

const lecturerCourses = courses.filter(c => c.lecturer.id === "user-3" || c.lecturer.id === "user-6");

export default function LecturerDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
        <p className="text-muted-foreground">
          Manage your courses and engage with your students.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {lecturerCourses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
      
      <div className="pt-6">
         <DocumentSummaryTool />
      </div>
    </div>
  );
}
