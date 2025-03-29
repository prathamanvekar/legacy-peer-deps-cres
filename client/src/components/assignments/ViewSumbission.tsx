import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { FileText, ArrowLeft, Download, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Assignment, mockAssignments, mockCourses } from '@/utils/mockData';

const ViewSubmission = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [courseName, setCourseName] = useState('');
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch assignment data
    const fetchData = () => {
      setLoading(true);
      try {
        // In a real app, you would fetch from an API
        const foundAssignment = mockAssignments.find(a => a.id === assignmentId);
        
        if (foundAssignment && user) {
          setAssignment(foundAssignment);
          
          // Find course name
          const course = mockCourses.find(c => c.id === foundAssignment.courseId);
          setCourseName(course ? course.title : 'Unknown Course');
          
          // Find student's submission
          const studentSubmission = foundAssignment.submissions.find(
            s => s.studentId === user.id
          );
          
          setSubmission(studentSubmission || null);
        }
      } catch (error) {
        console.error('Error fetching assignment data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [assignmentId, user]);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  // Check if assignment is past due
  const isPastDue = (dueDate: string): boolean => {
    const now = new Date();
    const due = new Date(dueDate);
    return now > due;
  };
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <p>Loading submission details...</p>
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
          <h1 className="text-3xl font-medium">Submission Details</h1>
        </div>
        
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
                  <p className={`font-medium flex items-center gap-1 ${
                    isPastDue(assignment.dueDate) ? 'text-red-500' : ''
                  }`}>
                    <Calendar className="h-4 w-4" />
                    {formatDate(assignment.dueDate)}
                    {isPastDue(assignment.dueDate) && ' (Past Due)'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Description</p>
                  <p className="text-gray-700">{assignment.description}</p>
                </div>
              </div>
            </GlassCard>
          </div>
          
          {/* Submission details */}
          <div className="lg:col-span-2">
            <GlassCard className={submission ? 'border-green-200' : 'border-red-200'}>
              <h2 className="text-xl font-medium mb-4">Your Submission</h2>
              
              {submission ? (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Assignment Submitted</p>
                      <p className="text-sm text-gray-600">
                        Submitted on {formatDate(submission.submittedAt)}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Submitted Files</p>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-blue-500" />
                          <span className="font-medium">{submission.fileName}</span>
                        </div>
                        <button className="glass-button-secondary">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {submission.comments && (
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Your Comments</p>
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <p className="text-gray-700">{submission.comments}</p>
                      </div>
                    </div>
                  )}
                  
                  {submission.grade !== undefined && (
                    <div className="p-4 rounded-lg bg-blue-50">
                      <h3 className="text-lg font-medium text-blue-800 mb-2">
                        Grade: {submission.grade}/100
                      </h3>
                      
                      {submission.feedback && (
                        <div>
                          <p className="text-sm text-gray-700 font-medium mb-1">Trainer Feedback:</p>
                          <p className="text-gray-700">{submission.feedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-red-50 rounded-lg flex items-center gap-3">
                  <XCircle className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="font-medium text-red-800">No Submission Found</p>
                    <p className="text-sm text-gray-600">
                      You haven't submitted this assignment yet.
                    </p>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={() => navigate(`/assignments/${assignmentId}/submit`)}
                  className="glass-button"
                >
                  {submission ? 'Resubmit Assignment' : 'Submit Assignment'}
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ViewSubmission;