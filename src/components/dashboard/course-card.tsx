'use client';
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const pathname = usePathname();
  const role = pathname.split('/')[1];

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={course.coverImage.url}
            alt={course.title}
            fill
            style={{objectFit: "cover"}}
            className="rounded-t-lg"
            data-ai-hint={course.coverImage.hint}
          />
        </div>
        <div className="p-6">
          <CardTitle>{course.title}</CardTitle>
          <CardDescription className="mt-2 h-10 overflow-hidden text-ellipsis">
            {course.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">
          Lecturer: {course.lecturer.name}
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/${role}/courses`}>View Course</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
