
import { useState } from 'react';
import { mockAssignments, mockCourses } from '@/utils/mockData';
import { StudentDashboardHeader } from './student/StudentDashboardHeader';
import { CourseJoinCard } from './student/CourseJoinCard';
import { AssignmentsCard } from './student/AssignmentsCard';
import { CompletedAssignmentsCard } from './student/CompletedAssignmentsCard';
import { CourseMaterialsList } from './student/CourseMaterialsList';
import { PendingAssignmentsList } from './student/PendingAssignmentsList';
import { formatDate, isDueSoon } from './student/StudentDashboardUtils';

export function StudentDashboard() {
  const [courses] = useState(mockCourses);
  const [assignments] = useState(mockAssignments);
  
  return (
    <div className="space-y-8">
      <StudentDashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <CourseJoinCard courses={courses} />
        <AssignmentsCard assignments={assignments} />
        <CompletedAssignmentsCard assignments={assignments} />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CourseMaterialsList courses={courses} />
        <PendingAssignmentsList 
          assignments={assignments} 
          formatDate={formatDate} 
          isDueSoon={isDueSoon} 
        />
      </div>
    </div>
  );
}
