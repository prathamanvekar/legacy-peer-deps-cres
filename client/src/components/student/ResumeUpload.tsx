
import { useState } from 'react';
import { Upload, File, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function ResumeUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState<string | undefined>(user?.resume);
  
  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      setUploading(false);
      setResumeUrl(`/resume/${file.name}`); // In a real app, this would be a server URL
      toast.success('Resume uploaded successfully');
    }, 1500);
  };
  
  return (
    <div className="mt-4 pt-4 border-t border-gray-100">
      <h3 className="font-medium mb-3">Resume</h3>
      
      {uploading ? (
        <div className="flex items-center justify-center py-2">
          <div className="w-5 h-5 border-2 border-t-transparent border-primary rounded-full animate-spin mr-2" />
          <span>Uploading...</span>
        </div>
      ) : resumeUrl ? (
        <div className="flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span>Resume Uploaded</span>
          </div>
          <div className="flex gap-2">
            <a 
              href={resumeUrl} 
              className="text-sm text-primary hover:underline flex items-center gap-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              <File className="h-4 w-4" />
              View Resume
            </a>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-sm"
              onClick={() => document.getElementById('resume-upload')?.click()}
            >
              Update
            </Button>
          </div>
        </div>
      ) : (
        <Button 
          onClick={() => document.getElementById('resume-upload')?.click()}
          className="flex items-center justify-center gap-1 w-full"
        >
          <Upload className="h-4 w-4" />
          Upload Resume
        </Button>
      )}
      
      <input 
        type="file" 
        id="resume-upload" 
        className="hidden" 
        accept=".pdf,.doc,.docx" 
        onChange={handleResumeUpload}
      />
    </div>
  );
}
