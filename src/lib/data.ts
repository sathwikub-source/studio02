import type { User, Course, UserRole } from "./types";
import { PlaceHolderImages } from "./placeholder-images";

const getPlaceholder = (id: string) => {
    const placeholder = PlaceHolderImages.find(p => p.id === id);
    if (!placeholder) {
        return { url: "https://picsum.photos/seed/default/600/400", hint: "abstract" };
    }
    return { url: placeholder.imageUrl, hint: placeholder.imageHint };
}

export const users: User[] = [
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

// Mock function to get current user. In a real app, this would come from an auth context.
export const getCurrentUser = (role: UserRole): User => {
    const user = users.find(u => u.role === role);
    if (!user) {
        // Fallback to the first user if no user with the specified role is found
        return users[0];
    }
    return user;
};
