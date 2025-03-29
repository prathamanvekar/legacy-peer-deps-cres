
import { Link } from 'react-router-dom';
import { BookOpen, FileText, User, Users } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Student, Trainer, Course, Assignment } from '@/utils/mockData';

interface DashboardStatsCardsProps {
  students: Student[];
  trainers: Trainer[];
  courses: Course[];
  assignments: Assignment[];
}

export function DashboardStatsCards({
  students,
  trainers,
  courses,
  assignments
}: DashboardStatsCardsProps) {
  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: `${students.length} currently enrolled`,
      path: '/students'
    },
    {
      title: 'Total Trainers',
      value: trainers.length,
      icon: <User className="h-6 w-6 text-green-500" />,
      change: `${trainers.filter(t => t.courses.length > 0).length} with active courses`,
      path: '/trainers'
    },
    {
      title: 'Active Courses',
      value: courses.length,
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      change: `${courses.reduce((total, course) => total + course.students.length, 0)} total enrollments`,
      path: '/courses'
    },
    {
      title: 'Assignments',
      value: assignments.length,
      icon: <FileText className="h-6 w-6 text-yellow-500" />,
      change: `${assignments.filter(a => new Date(a.dueDate) > new Date()).length} pending submissions`,
      path: '/assignments'
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <GlassCard key={index} className="flex flex-col h-full">
          <div className="flex justify-between mb-4">
            <div className="p-2 rounded-lg bg-white/50">{stat.icon}</div>
            <Link to={stat.path} className="text-sm text-primary hover:underline">
              Manage
            </Link>
          </div>
          <div className="mt-auto">
            <h3 className="text-2xl font-medium">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
          </div>
        </GlassCard>
      ))}
    </div>
  );
}
