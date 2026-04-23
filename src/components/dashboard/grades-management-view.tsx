'use client';

import { useState, useEffect } from 'react';
import { MoreHorizontal, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { grades as initialGrades, initialUsers, courses } from '@/lib/data';
import type { Grade, User } from '@/lib/types';
import { GradeFormDialog } from './grade-form-dialog';
import { Skeleton } from '../ui/skeleton';

const GRADES_STORAGE_KEY = 'study-spot-grades';
const USERS_STORAGE_KEY = 'study-spot-users';

export function GradesManagementView() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [gradeToEdit, setGradeToEdit] = useState<Grade | null>(null);
  const [gradeToDelete, setGradeToDelete] = useState<Grade | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedGradesRaw = localStorage.getItem(GRADES_STORAGE_KEY);
      if (storedGradesRaw) {
        setGrades(JSON.parse(storedGradesRaw).map((g: any) => ({ ...g, date: new Date(g.date) })));
      } else {
        setGrades(initialGrades);
        localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(initialGrades));
      }

      const storedUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      if (storedUsersRaw) {
        setUsers(JSON.parse(storedUsersRaw));
      } else {
        setUsers(initialUsers);
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setGrades(initialGrades);
      setUsers(initialUsers);
    }
    setIsMounted(true);
  }, []);

  const studentUsers = users.filter(u => u.role === 'student');

  const updateGradesInStateAndStorage = (newGrades: Grade[]) => {
    setGrades(newGrades);
    try {
      localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(newGrades));
    } catch (error) {
      console.error("Failed to save grades to localStorage", error);
    }
  };

  const handleSaveGrade = (data: Omit<Grade, 'id' | 'date'> & { id?: string }) => {
    let newGrades;
    const student = users.find(u => u.id === data.studentId);
    if (!student) return;
    
    if (data.id) {
      newGrades = grades.map(g => g.id === data.id ? { ...g, ...data, studentName: student.name, date: new Date() } : g);
      toast({ title: "Grade Updated", description: `Grade for ${student.name} has been updated.` });
    } else {
      const newGrade: Grade = { ...data, id: `grade-${Date.now()}`, studentName: student.name, date: new Date() };
      newGrades = [newGrade, ...grades];
      toast({ title: "Grade Added", description: `Grade for ${student.name} has been added.` });
    }
    updateGradesInStateAndStorage(newGrades);
    setIsFormOpen(false);
    setGradeToEdit(null);
  };

  const handleDeleteGrade = () => {
    if (!gradeToDelete) return;
    const newGrades = grades.filter(g => g.id !== gradeToDelete.id);
    updateGradesInStateAndStorage(newGrades);
    toast({ title: "Grade Deleted", description: "The grade has been removed.", variant: "destructive" });
    setGradeToDelete(null);
  };

  const handleOpenForm = (grade: Grade | null) => {
    setGradeToEdit(grade);
    setIsFormOpen(true);
  };
  
  if (!isMounted) {
     return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
           <Skeleton className="h-10 w-64" />
           <Skeleton className="h-10 w-32" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-96" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Manage Grades</h2>
          <p className="text-muted-foreground">
            Add, edit, or remove student grades.
          </p>
        </div>
        <Button onClick={() => handleOpenForm(null)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Grade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gradebook</CardTitle>
          <CardDescription>A list of all student grades.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.length > 0 ? (
                grades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.studentName}</TableCell>
                    <TableCell>{grade.courseName}</TableCell>
                    <TableCell>{grade.assessment}</TableCell>
                    <TableCell>{format(grade.date, 'PPP')}</TableCell>
                    <TableCell className="font-semibold">{grade.score}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onSelect={() => handleOpenForm(grade)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onSelect={() => setGradeToDelete(grade)} className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    No grades found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <GradeFormDialog 
        grade={gradeToEdit}
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        onSave={handleSaveGrade}
        students={studentUsers}
        courses={courses.map(c => c.title)}
      />

      <AlertDialog open={!!gradeToDelete} onOpenChange={(open) => !open && setGradeToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the grade for <span className="font-semibold">{gradeToDelete?.studentName}</span> in <span className="font-semibold">{gradeToDelete?.courseName}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setGradeToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteGrade} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
