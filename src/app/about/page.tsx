import Image from "next/image";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function AboutPage() {
  const aboutImage = PlaceHolderImages.find(p => p.id === "hero-1");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-primary sm:text-5xl md:text-6xl font-headline">
              About StudySpot
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-muted-foreground sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Empowering the next generation of learners and educators through technology.
            </p>
          </div>

          <div className="mt-12 lg:mt-24">
            <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl font-headline">
                  Our Mission
                </h2>
                <p className="mt-3 text-lg text-muted-foreground">
                  Our mission is to provide an accessible, intuitive, and powerful learning management system that fosters a collaborative and engaging educational environment. We believe that technology should break down barriers to education, not create them.
                </p>
                <div className="mt-8">
                  <h3 className="text-2xl font-extrabold text-foreground sm:text-3xl font-headline">
                    Our Vision
                  </h3>
                  <p className="mt-3 text-lg text-muted-foreground">
                    We envision a world where every student and educator has the tools they need to succeed. StudySpot aims to be the central hub for learning—your "spot" for education—making the process of teaching and learning more seamless, personalized, and effective.
                  </p>
                </div>
              </div>
              <div className="mt-10 lg:mt-0" aria-hidden="true">
                {aboutImage && (
                  <Image
                    className="mx-auto rounded-lg shadow-xl"
                    src={aboutImage.imageUrl}
                    alt="Students studying"
                    width={500}
                    height={500}
                    data-ai-hint={aboutImage.imageHint}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
