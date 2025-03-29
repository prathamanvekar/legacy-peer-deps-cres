
import { useState } from 'react';
import { TrainerForm } from '@/components/trainers/TrainerForm';
import { mockStudents, mockTrainers, mockCourses, mockAssignments } from '@/utils/mockData';
import { AdminDashboardHeader } from './admin/AdminDashboardHeader';
import { DashboardStatsCards } from './admin/DashboardStatsCards';
import { RecentTrainers } from './admin/RecentTrainers';
import { RecentStudents } from './admin/RecentStudents';
import { ActiveCoursesAndAssignments } from './admin/ActiveCoursesAndAssignments';

export function AdminDashboard() {
  const [students] = useState(mockStudents);
  const [trainers] = useState(mockTrainers);
  const [courses] = useState(mockCourses);
  const [assignments] = useState(mockAssignments);
  const [formOpen, setFormOpen] = useState(false);
  
  return (
    <div className="space-y-8">
      <AdminDashboardHeader onAddTrainer={() => setFormOpen(true)} />
      
      <DashboardStatsCards 
        students={students}
        trainers={trainers}
        courses={courses}
        assignments={assignments}
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTrainers 
          trainers={trainers} 
          onAddTrainer={() => setFormOpen(true)} 
        />
        
        <RecentStudents students={students} />
      </div>
      
      <ActiveCoursesAndAssignments 
        courses={courses}
        trainers={trainers}
        assignments={assignments}
      />
      
      {/* Add TrainerForm component */}
      <TrainerForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        editTrainerId={undefined}
      />
    </div>
  );
}
