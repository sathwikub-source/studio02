import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { assignments } from '@/lib/data';
import { format } from 'date-fns';

export default function AssignmentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Assignments</h2>
        <p className="text-muted-foreground">
          Here are your current assignments. Make sure to submit them on time.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Assignments</CardTitle>
          <CardDescription>
            Download the assignment files and get to work.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="font-semibold">{assignment.title}</p>
                    <p className="text-sm text-muted-foreground">{assignment.courseName}</p>
                    <p className="text-sm text-muted-foreground">
                      Due on {format(assignment.dueDate, 'PPP')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-shrink-0 gap-2">
                  <Button variant="outline" size="sm" asChild>
                     <a href={assignment.fileUrl} download>
                       <Download className="mr-2 h-4 w-4" />
                       Download
                     </a>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
