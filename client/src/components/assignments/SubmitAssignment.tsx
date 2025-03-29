import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  FileText, 
  ArrowLeft, 
  Upload, 
  Calendar, 
  XCircle, 
  AlertTriangle,
  X,
  Paperclip
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Assignment, mockAssignments, mockCourses } from '@/utils/mockData';

const SubmitAssignment = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseName, setCourseName] = useState('');
  const [existingSubmission, setExistingSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [files, setFiles] = useState<File[]>([]);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchData = () => {
      setLoading(true);
      try {
        const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (foundAssignment && user) {
          setAssignment(foundAssignment);
          
          const course = mockCourses.find(c => c.id === foundAssignment.courseId);
          setCourseName(course?.title || 'Course Not Found');
          
          const studentSubmission = foundAssignment.submissions?.find(
            s => s?.studentId === user.id
          );
          
        
        }
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [assignmentId, user]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const isPastDue = (dueDate: string): boolean => {
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles(Array.from(e.dataTransfer.files));
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      setError('Please attach at least one file for your submission.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/assignments/${assignmentId}`);
    }, 1500);
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading assignment details...</p>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!assignment || !user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <XCircle className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-xl mb-2">Assignment Not Found</h2>
          <p className="text-gray-600 mb-6">
            The assignment you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <button 
            onClick={() => navigate('/assignments')}
            className="glass-button"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Assignments
          </button>
        </div>
      </DashboardLayout>
    );
  }
  
  const pastDue = isPastDue(assignment.dueDate);
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/assignments')}
            className="glass-button-secondary"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="text-3xl font-medium">Submit Assignment</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Assignment details */}
            <div className="lg:col-span-1">
              <GlassCard>
                <h2 className="text-xl font-medium mb-4">Assignment Information</h2>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Title</p>
                    <p className="font-medium">{assignment.title}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Course</p>
                    <p className="font-medium">{courseName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className={`font-medium flex items-center gap-1 ${pastDue ? 'text-red-500' : ''}`}>
                      <Calendar className="h-4 w-4" />
                      {formatDate(assignment.dueDate)}
                      {pastDue && ' (Past Due)'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Description</p>
                    <p className="text-gray-700">{assignment.description}</p>
                  </div>
                </div>
                
                {existingSubmission && (
                  <div className="mt-6 p-3 bg-blue-50 rounded-lg text-sm">
                    <p className="font-medium text-blue-800">
                      You've previously submitted this assignment on {formatDate(existingSubmission.submittedAt)}.
                    </p>
                    <p className="text-gray-600 mt-1">
                      Submitting again will replace your previous submission.
                    </p>
                  </div>
                )}
                
                {pastDue && (
                  <div className="mt-6 p-3 bg-amber-50 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                    <p className="text-sm text-amber-800">
                      This assignment is past its due date. Late submissions may be subject to penalties.
                    </p>
                  </div>
                )}
              </GlassCard>
            </div>
            
            {/* Submission form */}
            <div className="lg:col-span-2">
              <GlassCard>
                <h2 className="text-xl font-medium mb-6">Your Submission</h2>
                
                {/* File upload area */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attachment(s) <span className="text-red-500">*</span>
                  </label>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  
                  {files.length === 0 ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors"
                    >
                      <Upload className="h-8 w-8 mx-auto mb-3 text-gray-400" />
                      <p className="text-sm font-medium text-gray-700 mb-1">
                        Drag and drop your files here or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, Word, Excel, PowerPoint, or ZIP files (Max 50MB)
                      </p>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-700">Selected Files</span>
                        <button
                          type="button"
                          onClick={() => setFiles([])}
                          className="text-xs text-gray-500 hover:text-gray-700"
                        >
                          Clear all
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {files.map((file, index) => (
                          <div 
                            key={index} 
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              <Paperclip className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{file.name}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Comments box */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comments (optional)
                  </label>
                  <textarea
                    value={comments}
                    onChange={e => setComments(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    rows={4}
                    placeholder="Add any additional notes or comments for your instructor..."
                  />
                </div>
                
                {/* Error message */}
                {error && (
                  <div className="mb-4 text-red-600 text-sm">
                    {error}
                  </div>
                )}
                
                {/* Submit button */}
                <button
                  type="submit"
                  className="glass-button"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Assignment'}
                </button>
              </GlassCard>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default SubmitAssignment;
