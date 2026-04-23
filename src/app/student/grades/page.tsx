'use client';

import { useState, useEffect } from 'react';
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
import { grades as initialGrades } from '@/lib/data';
import type { Grade, User } from '@/lib/types';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const GRADES_STORAGE_KEY = 'study-spot-grades';
const CURRENT_USER_STORAGE_KEY = 'study-spot-current-user';

export default function GradesPage() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    try {
      const storedGradesRaw = localStorage.getItem(GRADES_STORAGE_KEY);
      if (storedGradesRaw) {
        const storedGrades = JSON.parse(storedGradesRaw).map((g: any) => ({
          ...g,
          date: new Date(g.date),
        }));
        setGrades(storedGrades);
      } else {
        setGrades(initialGrades);
        localStorage.setItem(GRADES_STORAGE_KEY, JSON.stringify(initialGrades));
      }

      const currentUserRaw = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
      if (currentUserRaw) {
        setCurrentUser(JSON.parse(currentUserRaw));
      }
    } catch (error) {
      console.error("Failed to load data from localStorage", error);
      setGrades(initialGrades);
    }
    setIsMounted(true);
  }, []);
  
  const userGrades = currentUser ? grades.filter(g => g.studentId === currentUser.id) : [];

  if (!isMounted || !currentUser) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Grades</h2>
          <p className="text-muted-foreground">
            Loading your grades...
          </p>
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-48" />
          </CardContent>
        </Card>
      </div>
    );
  }

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
              {userGrades.length > 0 ? (
                userGrades.map((grade) => (
                  <TableRow key={grade.id}>
                    <TableCell className="font-medium">{grade.courseName}</TableCell>
                    <TableCell>{grade.assessment}</TableCell>
                    <TableCell>{format(grade.date, 'PPP')}</TableCell>
                    <TableCell className="text-right font-semibold">{grade.score}</TableCell>
                  </TableRow>
                ))
              ) : (
                 <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No grades have been posted for you yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
