'use client';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { coursesData } from "@/lib/catalog-data";

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFileUpload: (details: { file: File; courseName?: string; year?: string; semester?: string }) => void;
  context?: 'assignment' | 'material';
  courseInfo?: { course: string; year: string; semester: string };
}

const yearsData = [
  { name: "1st Year", semesters: ["1st Semester", "2nd Semester"] },
  { name: "2nd Year", semesters: ["3rd Semester", "4th Semester"] },
  { name: "3rd Year", semesters: ["5th Semester", "6th Semester"] },
];

export function FileUploadDialog({ open, onOpenChange, onFileUpload, context = 'material', courseInfo }: FileUploadDialogProps) {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [courseName, setCourseName] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [semesterOptions, setSemesterOptions] = useState<string[]>([]);

  useEffect(() => {
    const selectedYearData = yearsData.find(y => y.name === year);
    if (selectedYearData) {
        setSemesterOptions(selectedYearData.semesters);
    } else {
        setSemesterOptions([]);
    }
    // Reset semester when year changes
    setSemester('');
  }, [year]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFile(event.target.files?.[0] || null);
  };
  
  const resetState = () => {
    setSelectedFile(null);
    setCourseName('');
    setYear('');
    setSemester('');
    setSemesterOptions([]);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      resetState();
    }
    onOpenChange(isOpen);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    if (context === 'assignment' && (!courseName || !year || !semester)) {
      toast({
         title: "Missing details",
         description: "Please select a course, year, and semester.",
         variant: "destructive",
     });
     return;
    }
    
    onFileUpload({ file: selectedFile, courseName, year, semester });
    
    toast({
      title: "File Uploaded",
      description: `"${selectedFile.name}" has been successfully uploaded.`,
    });
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
          <DialogDescription>
            {context === 'assignment'
              ? "Select a file and specify the course details for the new assignment."
              : `Select a file to upload for ${courseInfo?.course} - ${courseInfo?.semester}.`
            }
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              File
            </Label>
            <Input id="file" type="file" onChange={handleFileChange} className="col-span-3" required />
          </div>

          {context === 'assignment' && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="course" className="text-right">Course</Label>
                <Select onValueChange={setCourseName} value={courseName}>
                  <SelectTrigger id="course" className="col-span-3">
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {coursesData.map(course => (
                      <SelectItem key={course.name} value={course.name}>{course.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="year" className="text-right">Year</Label>
                <Select onValueChange={setYear} value={year}>
                  <SelectTrigger id="year" className="col-span-3">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {yearsData.map(y => (
                      <SelectItem key={y.name} value={y.name}>{y.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="semester" className="text-right">Semester</Label>
                <Select onValueChange={setSemester} value={semester} disabled={!year}>
                  <SelectTrigger id="semester" className="col-span-3">
                    <SelectValue placeholder="Select a semester" />
                  </SelectTrigger>
                  <SelectContent>
                    {semesterOptions.map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>Cancel</Button>
            <Button type="submit">Upload</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
