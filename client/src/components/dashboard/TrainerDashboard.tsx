
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { mockAssignments, mockCourses, mockStudents } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { CourseForm } from '@/components/courses/CourseForm';
import { DashboardStats } from './DashboardStats';
import { CoursesList } from './CoursesList';
import { AssignmentsList } from './AssignmentsList';

export function TrainerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses] = useState(mockCourses);
  const [assignments] = useState(mockAssignments);
  const [formOpen, setFormOpen] = useState(false);
  
  // Get courses for this trainer
  const trainerCourses = courses.filter(course => course.trainerId === user?.id);
  
  // Get assignments for this trainer's courses
  const trainerAssignments = assignments.filter(
    assignment => trainerCourses.some(course => course.id === assignment.courseId)
  );
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Trainer Dashboard</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setFormOpen(true)}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Course
          </Button>
          <Button 
            onClick={() => navigate('/assignments/new')}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            New Assignment
          </Button>
        </div>
      </div>
      
      <DashboardStats 
        coursesCount={trainerCourses.length}
        assignmentsCount={trainerAssignments.length}
        studentsCount={mockStudents.length}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CoursesList 
          courses={trainerCourses}
          onCreateCourse={() => setFormOpen(true)}
          formatDate={formatDate}
        />
        
        <AssignmentsList 
          assignments={trainerAssignments}
          onCreateAssignment={() => navigate('/assignments/new')}
          formatDate={formatDate}
        />
      </div>

      {/* Course Form Sheet */}
      <CourseForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
      />
    </div>
  );
}
