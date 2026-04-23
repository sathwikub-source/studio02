export type UserRole = "student" | "lecturer" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lecturer: Pick<User, "id" | "name">;
  enrolledStudents: number;
  coverImage: {
    url: string;
    hint: string;
  }
}

export interface Assignment {
  id: string;
  title: string;
  courseId: string;
  courseName: string;
  year: string;
  semester: string;
  dueDate: Date;
  fileUrl: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  submittedAt: Date;
  grade?: string;
}

export interface CourseMaterial {
  id: string;
  course: string;
  year: string;
  semester: string;
  title: string;
  type: 'pdf' | 'ppt' | 'video';
  url: string;
  uploadedAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  studentName: string;
  courseName: string;
  assessment: string;
  score: string;
  date: Date;
}

export interface Notification {
    id: string;
    author: string;
    title: string;
    content: string;
    date: Date;
}

export interface DashboardNotification {
    id: string;
    type: 'assignment' | 'material' | 'exam' | 'announcement';
    title: string;
    description: string;
    date: Date;
    link: string;
}
