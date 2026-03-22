import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { SiteHeader } from '@/components/marketing/site-header';
import { SiteFooter } from '@/components/marketing/site-footer';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const features = [
  {
    icon: <GraduationCap className="size-8 text-primary" />,
    title: 'Intuitive Course Management',
    description: 'Easily create, organize, and manage your courses with our user-friendly interface for lecturers.',
  },
  {
    icon: <BookOpen className="size-8 text-primary" />,
    title: 'Seamless Learning Experience',
    description: 'Students can access materials, submit assignments, and track their progress all in one place.',
  },
  {
    icon: <Users className="size-8 text-primary" />,
    title: 'Powerful Admin Controls',
    description: 'Admins have a comprehensive overview of the platform, managing users, courses, and roles with ease.',
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(p => p.id === "hero-1");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <section className="bg-background">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-16">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Welcome to <span className="text-primary">StudySpot</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Your Smart Learning Hub. Empowering students and educators with a modern, collaborative learning environment.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register">
                      Get Started Free
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="/about">
                      Learn More
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                 {heroImage && (
                    <Image
                      alt="Hero"
                      className="aspect-video overflow-hidden rounded-xl object-cover"
                      data-ai-hint={heroImage.imageHint}
                      height="400"
                      src={heroImage.imageUrl}
                      width="600"
                    />
                  )}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  StudySpot is packed with powerful features designed for modern education, making learning and teaching more efficient and engaging.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              {features.map((feature, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <div className="mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32 bg-secondary">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Ready to Transform Your Learning Experience?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of students and educators who are already using StudySpot.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
               <Button asChild size="lg" className="w-full">
                  <Link href="/register">
                    Sign Up Now
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
