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
  dueDate: Date;
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
