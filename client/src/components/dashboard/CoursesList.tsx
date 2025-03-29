
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Course } from '@/utils/mockData';

interface CoursesListProps {
  courses: Course[];
  onCreateCourse: () => void;
  formatDate: (dateString: string) => string;
}

export function CoursesList({ courses, onCreateCourse, formatDate }: CoursesListProps) {
  const navigate = useNavigate();
  
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Your Courses</h3>
        <Button 
          onClick={() => navigate('/courses')}
          variant="link"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course.id}
              className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{course.title}</h4>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  {course.materials.filter(m => m.isReleased).length}/{course.materials.length} materials
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{course.description}</p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Created: {formatDate(course.createdAt)}
                </span>
                <Button
                  onClick={() => navigate(`/courses/${course.id}`)}
                  variant="link"
                  size="sm"
                  className="text-primary p-0 h-auto"
                >
                  Manage
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No courses yet.</p>
            <Button 
              onClick={onCreateCourse}
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
