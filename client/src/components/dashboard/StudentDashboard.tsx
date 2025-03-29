
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { BookOpen, Calendar, CheckCircle, FileText, Upload } from 'lucide-react';
import { mockAssignments, mockCourses } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { DeadlineReminder } from '@/components/assignments/DeadlineReminder';
import { SmartSummarizer } from '@/components/materials/SmartSummarizer';

export function StudentDashboard() {
  const { user } = useAuth();
  const [courses] = useState(mockCourses);
  const [assignments] = useState(mockAssignments);
  const [courseCode, setCourseCode] = useState('');
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const isDueSoon = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  };
  
  const getAssignmentStatus = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return 'pending';
    
    const submission = assignment.submissions.find(s => s.studentId === user?.id);
    return submission ? 'submitted' : 'pending';
  };
  
  const handleJoinCourse = () => {
    if (!courseCode.trim()) {
      toast.error("Please enter a course code");
      return;
    }
    
    toast.success(`Attempting to join course with code: ${courseCode}`);
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-medium">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-blue-100">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <h3 className="font-medium">Courses</h3>
          </div>
          <p className="text-3xl font-medium mb-1">{courses.length}</p>
          <p className="text-sm text-gray-600 mb-3">Enrolled courses</p>
          
          <div className="flex space-x-2 mt-2">
            <Input 
              placeholder="Enter course code" 
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleJoinCourse}
              variant="default"
            >
              Join
            </Button>
          </div>
          
          <Link 
            to="/courses" 
            className="mt-auto text-sm text-primary hover:underline"
          >
            View courses
          </Link>
        </GlassCard>
        
        <GlassCard className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-purple-100">
              <FileText className="h-5 w-5 text-purple-500" />
            </div>
            <h3 className="font-medium">Assignments</h3>
          </div>
          <p className="text-3xl font-medium mb-1">{assignments.length}</p>
          <p className="text-sm text-gray-600 mb-3">Total assignments</p>
          <Link 
            to="/assignments" 
            className="mt-auto text-sm text-primary hover:underline"
          >
            View assignments
          </Link>
        </GlassCard>
        
        <GlassCard className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-full bg-green-100">
              <CheckCircle className="h-5 w-5 text-green-500" />
            </div>
            <h3 className="font-medium">Completed</h3>
          </div>
          <p className="text-3xl font-medium mb-1">
            {assignments.filter(a => 
              a.submissions.some(s => s.studentId === user?.id)
            ).length}
          </p>
          <p className="text-sm text-gray-600 mb-3">Submitted assignments</p>
          <Link 
            to="/assignments?filter=completed" 
            className="mt-auto text-sm text-primary hover:underline"
          >
            View submissions
          </Link>
        </GlassCard>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Course Materials</h3>
            <Link to="/courses" className="text-sm text-primary hover:underline">
              All Courses
            </Link>
          </div>
          
          <div className="space-y-4">
            {courses.map((course) => {
              const releasedMaterials = course.materials.filter(m => m.isReleased);
              
              return (
                <div
                  key={course.id}
                  className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
                >
                  <h4 className="font-medium mb-3">{course.title}</h4>
                  
                  {releasedMaterials.length > 0 ? (
                    <div className="space-y-2">
                      {releasedMaterials.map((material) => (
                        <div
                          key={material.id}
                          className="flex flex-col bg-white/70 p-2 rounded"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-blue-500" />
                              <span className="text-sm">{material.title}</span>
                            </div>
                            <Link
                              to={material.url}
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                            >
                              View
                            </Link>
                          </div>
                          
                          {/* Smart Summarization Component */}
                          <SmartSummarizer 
                            materialId={material.id} 
                            materialTitle={material.title} 
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No materials available yet.</p>
                  )}
                </div>
              );
            })}
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Pending Assignments</h3>
            <Link to="/assignments" className="text-sm text-primary hover:underline">
              All Assignments
            </Link>
          </div>
          
          <div className="space-y-4">
            {assignments.map((assignment) => {
              const status = getAssignmentStatus(assignment.id);
              const dueSoon = isDueSoon(assignment.dueDate);
              const isSubmitted = status === 'submitted';
              
              return (
                <div
                  key={assignment.id}
                  className={`p-4 rounded-lg ${
                    isSubmitted 
                      ? 'bg-green-50/70' 
                      : dueSoon 
                        ? 'bg-amber-50/70' 
                        : 'bg-white/50'
                  } hover:bg-opacity-80 transition-colors`}
                >
                  <div className="flex justify-between mb-2">
                    <h4 className="font-medium">{assignment.title}</h4>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className={`text-xs ${
                        dueSoon ? 'text-amber-600 font-medium' : 'text-gray-500'
                      }`}>
                        Due {formatDate(assignment.dueDate)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {assignment.description.substring(0, 60)}
                    {assignment.description.length > 60 ? '...' : ''}
                  </p>
                  
                  {/* Deadline Reminder Component */}
                  <DeadlineReminder 
                    dueDate={assignment.dueDate}
                    title={assignment.title}
                    id={assignment.id}
                    isSubmitted={isSubmitted}
                  />
                  
                  <div className="flex justify-between items-center mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      isSubmitted 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {isSubmitted ? 'Submitted' : 'Pending'}
                    </span>
                    
                    <Link
                      to={`/assignments/${assignment.id}`}
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      {isSubmitted ? (
                        <>View Submission</>
                      ) : (
                        <>
                          <Upload className="h-3 w-3" />
                          Upload
                        </>
                      )}
                    </Link>
                  </div>
                </div>
              );
            })}
            
            {assignments.length === 0 && (
              <div className="text-center py-6 text-gray-500">
                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>No assignments pending.</p>
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
