import type { User, Course, UserRole, CourseMaterial, Assignment, Grade, Notification, DashboardNotification } from "./types";
import { PlaceHolderImages } from "./placeholder-images";

const getPlaceholder = (id: string) => {
    const placeholder = PlaceHolderImages.find(p => p.id === id);
    if (!placeholder) {
        return { url: "https://picsum.photos/seed/default/600/400", hint: "abstract" };
    }
    return { url: placeholder.imageUrl, hint: placeholder.imageHint };
}

export const initialUsers: User[] = [
    { id: "user-1", name: "Alice Johnson", email: "alice@example.com", role: "student", avatarUrl: "https://i.pravatar.cc/150?u=user-1" },
    { id: "user-2", name: "Bob Williams", email: "bob@example.com", role: "student", avatarUrl: "https://i.pravatar.cc/150?u=user-2" },
    { id: "user-3", name: "Dr. Carol Davis", email: "carol@example.com", role: "lecturer", avatarUrl: "https://i.pravatar.cc/150?u=user-3" },
    { id: "user-4", name: "David Miller", email: "david@example.com", role: "admin", avatarUrl: "https://i.pravatar.cc/150?u=user-4" },
    { id: "user-5", name: "Emily Brown", email: "emily@example.com", role: "student", avatarUrl: "https://i.pravatar.cc/150?u=user-5" },
    { id: "user-6", name: "Dr. Frank White", email: "frank@example.com", role: "lecturer", avatarUrl: "https://i.pravatar.cc/150?u=user-6" },
];

export const courses: Course[] = [
    {
        id: "course-1",
        title: "Introduction to Physics",
        description: "Explore the fundamental principles of classical mechanics and electromagnetism.",
        lecturer: { id: "user-3", name: "Dr. Carol Davis" },
        enrolledStudents: 34,
        coverImage: getPlaceholder("course-1"),
    },
    {
        id: "course-2",
        title: "History of Modern Art",
        description: "A survey of major art movements from the 19th century to the present day.",
        lecturer: { id: "user-6", name: "Dr. Frank White" },
        enrolledStudents: 22,
        coverImage: getPlaceholder("course-2"),
    },
    {
        id: "course-3",
        title: "Advanced Web Development",
        description: "Deep dive into modern frontend frameworks and backend architecture.",
        lecturer: { id: "user-3", name: "Dr. Carol Davis" },
        enrolledStudents: 18,
        coverImage: getPlaceholder("course-3"),
    },
    {
        id: "course-4",
        title: "Creative Writing Workshop",
        description: "Hone your skills in fiction, poetry, and non-fiction writing.",
        lecturer: { id: "user-6", name: "Dr. Frank White" },
        enrolledStudents: 15,
        coverImage: getPlaceholder("course-4"),
    },
    {
        id: "course-5",
        title: "Ancient Civilizations",
        description: "A journey through the history of the world's great ancient empires.",
        lecturer: { id: "user-6", name: "Dr. Frank White" },
        enrolledStudents: 25,
        coverImage: getPlaceholder("course-5"),
    }
];

export const materials: CourseMaterial[] = [
    { id: 'mat-1', course: 'BCA', year: '1st Year', semester: '1st Semester', title: 'Introduction to C Programming.pdf', type: 'pdf', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2024-05-10') },
    { id: 'mat-2', course: 'BCA', year: '1st Year', semester: '1st Semester', title: 'Digital Logic Fundamentals.ppt', type: 'ppt', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2024-05-12') },
    { id: 'mat-3', course: 'BBA', year: '2nd Year', semester: '3rd Semester', title: 'Marketing Management Introduction.mp4', type: 'video', url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', uploadedAt: new Date('2024-05-15') },
];

export const assignments: Assignment[] = [
    { id: 'assign-1', title: 'C Programming Basics.pdf', courseId: 'course-bca', courseName: 'BCA', year: '1st Year', semester: '1st Semester', dueDate: new Date('2024-09-15'), fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'assign-2', title: 'Business Communication Essay.pdf', courseId: 'course-bba', courseName: 'BBA', year: '1st Year', semester: '2nd Semester', dueDate: new Date('2024-09-20'), fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
    { id: 'assign-3', title: 'Calculus I Problems.pdf', courseId: 'course-bsc', courseName: 'BSc', year: '2nd Year', semester: '3rd Semester', dueDate: new Date('2024-10-01'), fileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' },
];

export const grades: Grade[] = [
    { id: 'grade-1', studentId: 'user-1', studentName: 'Alice Johnson', courseName: 'Introduction to Physics', assessment: 'Midterm Exam', score: '88%', date: new Date('2024-10-20') },
    { id: 'grade-2', studentId: 'user-2', studentName: 'Bob Williams', courseName: 'History of Modern Art', assessment: 'Final Essay', score: 'A-', date: new Date('2024-12-05') },
    { id: 'grade-3', studentId: 'user-1', studentName: 'Alice Johnson', courseName: 'Introduction to Physics', assessment: 'Lab Report 1', score: '92%', date: new Date('2024-09-30') },
    { id: 'grade-4', studentId: 'user-5', studentName: 'Emily Brown', courseName: 'Advanced Web Development', assessment: 'Project 1', score: 'B+', date: new Date('2024-11-15') },
];

export const notifications: Notification[] = [
    { id: 'notif-1', author: 'Dr. Carol Davis', title: 'Midterm Exam Schedule', content: 'The midterm exam for Introduction to Physics will be held on Oct 20th.', date: new Date('2024-10-05') },
    { id: 'notif-2', author: 'Platform Admin', title: 'Scheduled Maintenance', content: 'The StudySpot platform will be down for scheduled maintenance this Sunday from 2 AM to 4 AM.', date: new Date('2024-10-10') },
    { id: 'notif-3', author: 'Dr. Frank White', title: 'Guest Lecture Announcement', content: 'There will be a guest lecture for History of Modern Art next week. Attendance is highly encouraged.', date: new Date('2024-11-01') },
];

export const dashboardNotifications: DashboardNotification[] = [
    { 
        id: 'd-notif-1', 
        type: 'assignment', 
        title: 'New assignment: C Programming Basics', 
        description: 'Due on Sep 15, 2024',
        date: new Date('2024-09-01'),
        link: '/student/assignments' 
    },
    { 
        id: 'd-notif-2', 
        type: 'material', 
        title: 'New material for BCA',
        description: 'Introduction to C Programming.pdf has been uploaded.',
        date: new Date('2024-05-10'),
        link: '/student/courses/bca/1st-year/1st-semester'
    },
    { 
        id: 'd-notif-3', 
        type: 'exam', 
        title: 'Midterm Exam Grade Posted', 
        description: 'Your grade for the Physics Midterm is available.',
        date: new Date('2024-10-20'),
        link: '/student/grades'
    },
    {
        id: 'd-notif-4',
        type: 'announcement',
        title: 'Scheduled Maintenance',
        description: 'The platform will be down for maintenance this Sunday.',
        date: new Date('2024-10-10'),
        link: '/student/announcements'
    }
];

export const lecturerDashboardNotifications: DashboardNotification[] = [
    {
        id: 'l-notif-1',
        type: 'assignment',
        title: 'Submission from Alice Johnson',
        description: 'Assignment "C Programming Basics" was submitted.',
        date: new Date('2024-09-14'),
        link: '/lecturer/assignments'
    },
    {
        id: 'l-notif-2',
        type: 'announcement',
        title: 'You posted an announcement',
        description: '"Midterm Exam Schedule" was published.',
        date: new Date('2024-10-05'),
        link: '/lecturer/announcements'
    },
    {
        id: 'l-notif-3',
        type: 'material',
        title: 'You uploaded a new material',
        description: 'File "Digital Logic Fundamentals.ppt" is now available for students.',
        date: new Date('2024-05-12'),
        link: '/lecturer/courses/bca/1st-year/1st-semester'
    }
];
