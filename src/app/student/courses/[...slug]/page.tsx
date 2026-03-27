import { SemesterMaterials } from '@/components/dashboard/semester-materials';

export default function SemesterPage({ params }: { params: { slug: string[] } }) {
  const [course, year, semester] = params.slug.map(slug => decodeURIComponent(slug).replace(/-/g, ' '));

  return (
    <SemesterMaterials
      role="student"
      course={course}
      year={year}
      semester={semester}
    />
  );
}
