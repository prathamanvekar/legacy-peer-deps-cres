
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockAssignments, mockCourses, mockStudents } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { CourseForm } from '@/components/courses/CourseForm';
import { DashboardStats } from './DashboardStats';
import { CoursesList } from './CoursesList';
import { AssignmentsList } from './AssignmentsList';
import { TrainerDashboardHeader } from './trainer/TrainerDashboardHeader';
import { formatDate } from './trainer/trainerDashboardUtils';

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
  
  return (
    <div className="space-y-8">
      <TrainerDashboardHeader onCreateCourse={() => setFormOpen(true)} />
      
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
