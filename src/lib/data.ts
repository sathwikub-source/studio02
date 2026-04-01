import type { User, Course, UserRole, CourseMaterial } from "./types";
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
    }
];

export const materials: CourseMaterial[] = [
    { id: 'mat-1', course: 'BCA', year: '1st Year', semester: '1st Semester', title: 'Introduction to C Programming.pdf', type: 'pdf', url: '#', uploadedAt: new Date('2024-05-10') },
    { id: 'mat-2', course: 'BCA', year: '1st Year', semester: '1st Semester', title: 'Digital Logic Fundamentals.ppt', type: 'ppt', url: '#', uploadedAt: new Date('2024-05-12') },
    { id: 'mat-3', course: 'BBA', year: '2nd Year', semester: '3rd Semester', title: 'Marketing Management Introduction.video', type: 'video', url: '#', uploadedAt: new Date('2024-05-15') },
];
