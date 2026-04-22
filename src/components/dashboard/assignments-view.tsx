'use client';

import { useState, useEffect } from 'react';
import { assignments as initialAssignments } from '@/lib/data';
import type { UserRole, Assignment } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from '@/components/ui/button';
import { Download, Upload, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { FileUploadDialog } from './file-upload-dialog';
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
import { useToast } from "@/hooks/use-toast";

interface AssignmentsViewProps {
  role: UserRole;
}

const ASSIGNMENTS_STORAGE_KEY = 'study-spot-assignments';

export function AssignmentsView({ role }: AssignmentsViewProps) {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedAssignmentsRaw = localStorage.getItem(ASSIGNMENTS_STORAGE_KEY);
      if (storedAssignmentsRaw) {
        const storedAssignments = JSON.parse(storedAssignmentsRaw).map((a: any) => ({
          ...a,
          dueDate: new Date(a.dueDate),
        }));
        setAssignments(storedAssignments);
      } else {
        setAssignments(initialAssignments);
        localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(initialAssignments));
      }
    } catch (error) {
      console.error("Failed to load assignments from localStorage", error);
      setAssignments(initialAssignments);
    }
  }, []);

  const updateAssignmentsInStateAndStorage = (newAssignments: Assignment[]) => {
    setAssignments(newAssignments);
    try {
      localStorage.setItem(ASSIGNMENTS_STORAGE_KEY, JSON.stringify(newAssignments));
    } catch (error) {
      console.error("Failed to save assignments to localStorage", error);
    }
  };

  const handleFileUpload = (details: { file: File; courseName?: string; year?: string; semester?: string }) => {
    const newAssignment: Assignment = {
      id: `assign-${Date.now()}`,
      title: details.file.name,
      courseId: `course-${details.courseName?.toLowerCase() || 'unknown'}`,
      courseName: details.courseName || "Uncategorized",
      year: details.year || "N/A",
      semester: details.semester || "N/A",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
      fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };
    updateAssignmentsInStateAndStorage([newAssignment, ...assignments]);
  };

  const handleDeleteAssignment = () => {
    if (!assignmentToDelete) return;

    const newAssignments = assignments.filter(a => a.id !== assignmentToDelete.id);
    updateAssignmentsInStateAndStorage(newAssignments);
    toast({
      title: "Assignment Deleted",
      description: `"${assignmentToDelete.title}" has been removed.`,
      variant: "destructive",
    });
    setAssignmentToDelete(null);
  };
  
  const canManage = role === 'admin' || role === 'lecturer';

  // Group assignments by course -> year -> semester
  const assignmentsByCourse = assignments.reduce(
    (acc, assignment) => {
      const courseName = assignment.courseName || "Uncategorized";
      const year = assignment.year || "Unspecified Year";
      const semester = assignment.semester || "Unspecified Semester";

      if (!acc[courseName]) {
        acc[courseName] = {};
      }
      if (!acc[courseName][year]) {
        acc[courseName][year] = {};
      }
      if (!acc[courseName][year][semester]) {
        acc[courseName][year][semester] = [];
      }
      acc[courseName][year][semester].push(assignment);

      return acc;
    },
    {} as { [courseName: string]: { [year: string]: { [semester: string]: Assignment[] } } }
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">All Assignments</h2>
          <p className="text-muted-foreground">
            Browse, download, and manage all assignments on the platform.
          </p>
        </div>
        {canManage && (
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload Assignment
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Assignments Catalog</CardTitle>
          <CardDescription>
            {canManage 
              ? "Upload, download, or delete assignments." 
              : "Download the assignment files and get to work."
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {Object.keys(assignmentsByCourse).length > 0 ? (
            <Accordion type="multiple" className="w-full">
              {Object.entries(assignmentsByCourse).map(([courseName, years]) => (
                <AccordionItem value={courseName} key={courseName}>
                  <AccordionTrigger className="text-lg font-semibold">{courseName}</AccordionTrigger>
                  <AccordionContent>
                    <Accordion type="multiple" className="w-full px-4">
                      {Object.entries(years).map(([year, semesters]) => (
                        <AccordionItem value={`${courseName}-${year}`} key={year}>
                          <AccordionTrigger>{year}</AccordionTrigger>
                          <AccordionContent>
                            <Accordion type="multiple" className="w-full px-4">
                              {Object.entries(semesters).map(([semester, semesterAssignments]) => (
                                <AccordionItem value={`${courseName}-${year}-${semester}`} key={semester}>
                                  <AccordionTrigger>{semester}</AccordionTrigger>
                                  <AccordionContent>
                                    <div className="space-y-4 pt-2 pl-4">
                                      {semesterAssignments.map((assignment) => (
                                        <div key={assignment.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
                                          <div className="flex items-center gap-4">
                                            <div>
                                              <p className="font-semibold">{assignment.title}</p>
                                              <p className="text-sm text-muted-foreground">
                                                Due on {format(assignment.dueDate, 'PPP')}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex flex-shrink-0 gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                              <a href={assignment.fileUrl} download={assignment.title}>
                                                <Download className="mr-2 h-4 w-4" />
                                                Offline Access
                                              </a>
                                            </Button>
                                            {canManage && (
                                              <Button variant="destructive" size="sm" onClick={() => setAssignmentToDelete(assignment)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete
                                              </Button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
             <div className="py-10 text-center">
              <p className="text-muted-foreground">No assignments have been uploaded yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {canManage && (
         <FileUploadDialog 
            open={isUploadDialogOpen} 
            onOpenChange={setUploadDialogOpen} 
            onFileUpload={handleFileUpload}
            context="assignment"
         />
      )}

      <AlertDialog open={!!assignmentToDelete} onOpenChange={(open) => !open && setAssignmentToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the assignment <span className="font-semibold">{assignmentToDelete?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setAssignmentToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAssignment} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
