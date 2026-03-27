'use client';
import { useState } from 'react';
import { materials } from '@/lib/data';
import type { UserRole } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, Upload, Video, Presentation } from 'lucide-react';
import { FileUploadDialog } from './file-upload-dialog';

interface SemesterMaterialsProps {
  role: UserRole;
  course: string;
  year: string;
  semester: string;
}

const fileIcons = {
  pdf: <FileText className="h-6 w-6 text-red-500" />,
  ppt: <Presentation className="h-6 w-6 text-orange-500" />,
  video: <Video className="h-6 w-6 text-blue-500" />,
};

// Helper to capitalize words
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capitalizeWords = (s: string) => s.split(' ').map(capitalize).join(' ');

export function SemesterMaterials({ role, course, year, semester }: SemesterMaterialsProps) {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);

  const formattedCourse = course.toUpperCase();
  const formattedYear = capitalizeWords(year);
  const formattedSemester = capitalizeWords(semester);

  const filteredMaterials = materials.filter(
    (m) =>
      m.course.toUpperCase() === formattedCourse &&
      m.year === formattedYear &&
      m.semester === formattedSemester
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{`${formattedCourse} - ${formattedYear}, ${formattedSemester}`}</h2>
          <p className="text-muted-foreground">
            Course materials for this semester.
          </p>
        </div>
        {(role === 'admin' || role === 'lecturer') && (
          <Button onClick={() => setUploadDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" />
            Upload File
          </Button>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
          <CardDescription>
            You can view files online or download them for offline access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredMaterials.length > 0 ? (
            <div className="space-y-4">
              {filteredMaterials.map((material) => (
                <div key={material.id} className="flex flex-wrap items-center justify-between gap-4 rounded-md border p-4">
                  <div className="flex items-center gap-4">
                    {fileIcons[material.type]}
                    <div>
                      <p className="font-semibold">{material.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {material.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                       <a href={material.url} download>
                         <Download className="mr-2 h-4 w-4" />
                         Offline
                       </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No materials have been uploaded for this semester yet.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {(role === 'admin' || role === 'lecturer') && (
         <FileUploadDialog open={isUploadDialogOpen} onOpenChange={setUploadDialogOpen} />
      )}
    </div>
  );
}
