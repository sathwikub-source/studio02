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
import { grades } from '@/lib/data';
import { format } from 'date-fns';

export default function GradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Grades</h2>
        <p className="text-muted-foreground">
          Check your performance and results for all your courses.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Your Grades</CardTitle>
          <CardDescription>
            A summary of your grades for submitted assignments and exams.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">{grade.courseName}</TableCell>
                  <TableCell>{grade.assessment}</TableCell>
                  <TableCell>{format(grade.date, 'PPP')}</TableCell>
                  <TableCell className="text-right font-semibold">{grade.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
