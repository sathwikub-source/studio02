'use client';

import Link from "next/link";
import { usePathname } from 'next/navigation';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { coursesData } from "@/lib/catalog-data";

const slugify = (text: string) => text.toLowerCase().replace(/\s+/g, '-');

export function CourseCatalog() {
  const pathname = usePathname();
  // This will give us the base path like /student/courses or /admin/courses
  const basePath = pathname.split('/').slice(0, 3).join('/');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold tracking-tight">Courses</h2>
      <p className="text-muted-foreground">
        Browse available courses, years, and semesters.
      </p>
      <Card>
        <CardHeader>
          <CardTitle>Course Catalog</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="w-full">
            {coursesData.map((course) => (
              <AccordionItem value={course.name} key={course.name}>
                <AccordionTrigger className="text-lg font-semibold">{course.name}</AccordionTrigger>
                <AccordionContent>
                  <Accordion type="multiple" className="w-full px-4">
                    {course.years.map((year) => (
                      <AccordionItem value={`${course.name}-${year.name}`} key={year.name}>
                        <AccordionTrigger>{year.name}</AccordionTrigger>
                        <AccordionContent>
                          <ul className="list-disc space-y-2 pl-6 text-muted-foreground">
                            {year.semesters.map((semester) => (
                              <li key={semester} className="cursor-pointer hover:text-foreground">
                                <Link href={`${basePath}/${slugify(course.name)}/${slugify(year.name)}/${slugify(semester)}`}>
                                  {semester}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
