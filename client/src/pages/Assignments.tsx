
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { FileText, Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Assignment, mockAssignments, mockCourses } from '@/utils/mockData';

const Assignments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignments] = useState(mockAssignments);
  const [courses] = useState(mockCourses);
  
  // Filter assignments based on user role
  const getFilteredAssignments = (): Assignment[] => {
    if (user?.role === 'trainer') {
      // Get trainer's courses
      const trainerCourses = courses.filter(c => c.trainerId === user.id);
      // Get assignments for trainer's courses
      return assignments.filter(a => 
        trainerCourses.some(c => c.id === a.courseId)
      );
    }
    return assignments;
  };
  
  const filteredAssignments = getFilteredAssignments();
  
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
  
  // Get course name for an assignment
  const getCourseName = (courseId: string): string => {
    const course = courses.find(c => c.id === courseId);
    return course ? course.title : 'Unknown Course';
  };
  
  // Get assignment status for the current student
  const getStudentSubmissionStatus = (assignment: Assignment) => {
    if (user?.role !== 'student') return null;
    
    const submission = assignment.submissions.find(s => s.studentId === user.id);
    return submission 
      ? { status: 'submitted', grade: submission.grade, feedback: submission.feedback } 
      : { status: 'pending' };
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium">Assignments</h1>
          
          {/* Only show add assignment button for admin and trainer */}
          {(user?.role === 'admin' || user?.role === 'trainer') && (
            <button 
              onClick={() => navigate('/assignments/new')}
              className="flex items-center gap-1 glass-button"
            >
              <Plus className="h-4 w-4" />
              Add Assignment
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {filteredAssignments.map((assignment) => {
            const studentSubmission = getStudentSubmissionStatus(assignment);
            const pastDue = isPastDue(assignment.dueDate);
            
            return (
              <GlassCard 
                key={assignment.id} 
                className={`transition-all duration-300 hover:shadow-xl ${
                  studentSubmission?.status === 'submitted'
                    ? 'border-green-200'
                    : pastDue
                      ? 'border-red-200'
                      : ''
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h2 className="text-xl font-medium">{assignment.title}</h2>
                      
                      {studentSubmission && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          studentSubmission.status === 'submitted'
                            ? 'bg-green-100 text-green-800'
                            : pastDue
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {studentSubmission.status === 'submitted' 
                            ? 'Submitted' 
                            : pastDue 
                              ? 'Past Due' 
                              : 'Pending'}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{assignment.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4 text-blue-500" />
                        <span>{getCourseName(assignment.courseId)}</span>
                      </div>
                      
                      <div className={`flex items-center gap-1 ${
                        pastDue ? 'text-red-500' : ''
                      }`}>
                        <Calendar className="h-4 w-4" />
                        <span>
                          Due: {formatDate(assignment.dueDate)}
                          {pastDue && ' (Past Due)'}
                        </span>
                      </div>
                      
                      {(user?.role === 'admin' || user?.role === 'trainer') && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>{assignment.submissions.length} submissions</span>
                        </div>
                      )}
                    </div>
                    
                    {studentSubmission?.grade && (
                      <div className="mt-3 p-2 rounded bg-green-50">
                        <div className="font-medium text-green-800">
                          Grade: {studentSubmission.grade}/100
                        </div>
                        {studentSubmission.feedback && (
                          <div className="text-sm text-gray-700 mt-1">
                            Feedback: {studentSubmission.feedback}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => navigate(`/assignments/${assignment.id}`)}
                      className="glass-button w-full md:w-auto"
                    >
                      {user?.role === 'student'
                        ? studentSubmission?.status === 'submitted'
                          ? 'View Submission'
                          : 'Submit Assignment'
                        : 'View Details'}
                    </button>
                    
                    {/* Only show manage button for admin and trainer */}
                    {(user?.role === 'admin' || user?.role === 'trainer') && (
                      <button
                        onClick={() => navigate(`/assignments/${assignment.id}/submissions`)}
                        className="text-sm text-primary hover:underline"
                      >
                        Review Submissions
                      </button>
                    )}
                  </div>
                </div>
              </GlassCard>
            );
          })}
          
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h2 className="text-xl mb-2">No Assignments Available</h2>
              <p className="text-gray-600 mb-6">
                {user?.role === 'trainer'
                  ? "You haven't created any assignments yet."
                  : "There are no assignments available at the moment."}
              </p>
              
              {(user?.role === 'admin' || user?.role === 'trainer') && (
                <button 
                  onClick={() => navigate('/assignments/new')}
                  className="glass-button"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Create First Assignment
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assignments;
