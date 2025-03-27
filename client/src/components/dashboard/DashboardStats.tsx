
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { BookOpen, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardStatsProps {
  coursesCount: number;
  assignmentsCount: number;
  studentsCount: number;
}

export function DashboardStats({ coursesCount, assignmentsCount, studentsCount }: DashboardStatsProps) {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <GlassCard className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-blue-100">
            <BookOpen className="h-5 w-5 text-blue-500" />
          </div>
          <h3 className="font-medium">Your Courses</h3>
        </div>
        <p className="text-3xl font-medium mb-1">{coursesCount}</p>
        <p className="text-sm text-gray-600 mb-3">Active courses</p>
        <Button 
          onClick={() => navigate('/courses')}
          className="mt-auto" 
          variant="outline"
          size="sm"
        >
          Manage courses
        </Button>
      </GlassCard>
      
      <GlassCard className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-purple-100">
            <FileText className="h-5 w-5 text-purple-500" />
          </div>
          <h3 className="font-medium">Assignments</h3>
        </div>
        <p className="text-3xl font-medium mb-1">{assignmentsCount}</p>
        <p className="text-sm text-gray-600 mb-3">Active assignments</p>
        <Button 
          onClick={() => navigate('/assignments')}
          className="mt-auto" 
          variant="outline"
          size="sm"
        >
          View assignments
        </Button>
      </GlassCard>
      
      <GlassCard className="flex flex-col h-full">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-full bg-green-100">
            <Users className="h-5 w-5 text-green-500" />
          </div>
          <h3 className="font-medium">Students</h3>
        </div>
        <p className="text-3xl font-medium mb-1">{studentsCount}</p>
        <p className="text-sm text-gray-600 mb-3">Enrolled students</p>
        <Button 
          onClick={() => navigate('/students')}
          className="mt-auto" 
          variant="outline"
          size="sm"
        >
          Manage students
        </Button>
      </GlassCard>
    </div>
  );
}
