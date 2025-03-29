
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Course, Trainer, Assignment } from '@/utils/mockData';

interface ActiveCoursesAndAssignmentsProps {
  courses: Course[];
  trainers: Trainer[];
  assignments: Assignment[];
}

export function ActiveCoursesAndAssignments({ 
  courses, 
  trainers, 
  assignments 
}: ActiveCoursesAndAssignmentsProps) {
  const navigate = useNavigate();
  
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Active Courses & Assignments</h3>
        <div className="flex gap-2">
          <Link to="/courses" className="text-sm text-primary hover:underline">
            All Courses
          </Link>
          <span className="text-gray-400">|</span>
          <Link to="/assignments" className="text-sm text-primary hover:underline">
            All Assignments
          </Link>
        </div>
      </div>
      
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => {
            // Find trainer for this course
            const trainer = trainers.find(t => t.id === course.trainerId);
            // Find assignments for this course
            const courseAssignments = assignments.filter(a => a.courseId === course.id);
            
            return (
              <div
                key={course.id}
                className="p-4 rounded-lg bg-white/50"
              >
                <div className="flex justify-between mb-2">
                  <div>
                    <h4 className="font-medium">{course.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>Trainer: {trainer?.name || 'Unassigned'}</span>
                      <span>•</span>
                      <span>Course Code: <span className="font-mono bg-gray-100 px-1 rounded">{course.courseCode}</span></span>
                      <span>•</span>
                      <span>{course.students.length} Students Enrolled</span>
                    </div>
                  </div>
                  <Link 
                    to={`/courses/${course.id}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Course
                  </Link>
                </div>
                
                {courseAssignments.length > 0 ? (
                  <div className="mt-3 border-t pt-2">
                    <p className="text-sm font-medium mb-2">Associated Assignments:</p>
                    <div className="space-y-2">
                      {courseAssignments.map((assignment) => (
                        <div key={assignment.id} className="flex justify-between items-center bg-white/70 rounded p-2 text-sm">
                          <div>
                            <span className="font-medium">{assignment.title}</span>
                            <span className="text-xs text-gray-500 ml-2">Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                          </div>
                          <Link 
                            to={`/assignments/${assignment.id}`}
                            className="text-xs text-primary hover:underline"
                          >
                            Details
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-500 mt-2">No assignments for this course yet.</p>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>No active courses at the moment.</p>
            <Button 
              onClick={() => navigate('/courses/new')}
              variant="link"
              className="mt-2"
            >
              Create your first course
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
