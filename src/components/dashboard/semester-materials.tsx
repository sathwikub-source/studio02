'use client';
import { useState, useEffect } from 'react';
import { materials as initialMaterials } from '@/lib/data';
import type { UserRole, CourseMaterial } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, Upload, Video, Presentation, Trash2 } from 'lucide-react';
import { FileUploadDialog } from './file-upload-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";


interface SemesterMaterialsProps {
  role: UserRole;
  course: string;
  year: string;
  semester: string;
}

const fileIcons: { [key: string]: React.ReactNode } = {
  pdf: <FileText className="h-6 w-6 text-destructive" />,
  ppt: <Presentation className="h-6 w-6 text-primary" />,
  video: <Video className="h-6 w-6 text-accent" />,
  unknown: <FileText className="h-6 w-6 text-muted-foreground" />,
};

const getFileType = (fileName: string): 'pdf' | 'ppt' | 'video' => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension === 'pdf') return 'pdf';
    if (extension === 'ppt' || extension === 'pptx') return 'ppt';
    if (['mp4', 'mov', 'avi', 'webm'].includes(extension || '')) return 'video';
    return 'pdf'; // default
};


// Helper to capitalize words
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const capitalizeWords = (s: string) => s.split(' ').map(capitalize).join(' ');

const MATERIALS_STORAGE_KEY = 'study-spot-materials';


export function SemesterMaterials({ role, course, year, semester }: SemesterMaterialsProps) {
  const [isUploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [materials, setMaterials] = useState<CourseMaterial[]>([]);
  const [materialToDelete, setMaterialToDelete] = useState<CourseMaterial | null>(null);
  const { toast } = useToast();

  const formattedCourse = course.toUpperCase();
  const formattedYear = capitalizeWords(year);
  const formattedSemester = capitalizeWords(semester);

  useEffect(() => {
    try {
        const storedMaterialsRaw = localStorage.getItem(MATERIALS_STORAGE_KEY);
        if (storedMaterialsRaw) {
            const storedMaterials = JSON.parse(storedMaterialsRaw).map((m: any) => ({
                ...m,
                uploadedAt: new Date(m.uploadedAt),
            }));
            setMaterials(storedMaterials);
        } else {
            setMaterials(initialMaterials);
            localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(initialMaterials));
        }
    } catch (error) {
        console.error("Failed to load materials from localStorage", error);
        setMaterials(initialMaterials);
    }
  }, []);

  const updateMaterialsInStateAndStorage = (newMaterials: CourseMaterial[]) => {
    setMaterials(newMaterials);
    try {
      localStorage.setItem(MATERIALS_STORAGE_KEY, JSON.stringify(newMaterials));
    } catch (error) {
      console.error("Failed to save materials to localStorage", error);
    }
  };
  
  const handleFileUpload = (details: { file: File }) => {
    const newMaterial: CourseMaterial = {
        id: `mat-${Date.now()}`,
        title: details.file.name,
        type: getFileType(details.file.name),
        url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        uploadedAt: new Date(),
        course: formattedCourse,
        year: formattedYear,
        semester: formattedSemester,
    };
    updateMaterialsInStateAndStorage([newMaterial, ...materials]);
  };

  const handleDeleteMaterial = () => {
    if (!materialToDelete) return;

    const newMaterials = materials.filter(m => m.id !== materialToDelete.id);
    updateMaterialsInStateAndStorage(newMaterials);
    toast({
      title: "Material Deleted",
      description: `"${materialToDelete.title}" has been removed.`,
      variant: "destructive",
    });
    setMaterialToDelete(null);
  };


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
                    {fileIcons[material.type] || fileIcons.unknown}
                    <div>
                      <p className="font-semibold">{material.title}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on {material.uploadedAt.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <Button variant="outline" size="sm" onClick={() => window.open(material.url, '_blank')}>
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                       <a href={material.url} download={material.title}>
                         <Download className="mr-2 h-4 w-4" />
                         Offline Access
                       </a>
                    </Button>
                    {(role === 'admin' || role === 'lecturer') && (
                        <Button variant="destructive" size="sm" onClick={() => setMaterialToDelete(material)}>
                           <Trash2 className="mr-2 h-4 w-4" />
                           Delete
                        </Button>
                    )}
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
         <FileUploadDialog 
            open={isUploadDialogOpen} 
            onOpenChange={setUploadDialogOpen} 
            onFileUpload={handleFileUpload}
            context="material"
            courseInfo={{ course: formattedCourse, year: formattedYear, semester: formattedSemester }}
        />
      )}
       <AlertDialog open={!!materialToDelete} onOpenChange={(open) => !open && setMaterialToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the file <span className="font-semibold">{materialToDelete?.title}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMaterialToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMaterial} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
