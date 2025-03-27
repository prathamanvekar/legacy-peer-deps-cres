
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Plus, User, Users, BookOpen, BarChart } from 'lucide-react';
import { mockStudents, mockTrainers } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { TrainerForm } from '@/components/trainers/TrainerForm';

export function AdminDashboard() {
  const navigate = useNavigate();
  const [students] = useState(mockStudents);
  const [trainers] = useState(mockTrainers);
  const [formOpen, setFormOpen] = useState(false);
  
  const stats = [
    {
      title: 'Total Students',
      value: students.length,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: '+5% from last month',
      path: '/students'
    },
    {
      title: 'Total Trainers',
      value: trainers.length,
      icon: <User className="h-6 w-6 text-green-500" />,
      change: '+2 new this month',
      path: '/trainers'
    },
    {
      title: 'Active Courses',
      value: 2,
      icon: <BookOpen className="h-6 w-6 text-purple-500" />,
      change: '+1 from last month',
      path: '/courses'
    },
    {
      title: 'Completion Rate',
      value: '87%',
      icon: <BarChart className="h-6 w-6 text-yellow-500" />,
      change: '+3% from last month',
      path: '/analytics'
    }
  ];
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Admin Dashboard</h1>
        <Button 
          onClick={() => setFormOpen(true)}
          className="flex items-center gap-1"
          size="sm"
        >
          <Plus className="h-4 w-4" />
          Add New Trainer
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <GlassCard key={index} className="flex flex-col h-full">
            <div className="flex justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/50">{stat.icon}</div>
              <Link to={stat.path} className="text-sm text-primary hover:underline">
                View
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
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Trainers</h3>
            <Link to="/trainers" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {trainers.map((trainer) => (
              <div 
                key={trainer.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={`https://i.pravatar.cc/40?img=${parseInt(trainer.id) + 10}`}
                      alt={trainer.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{trainer.name}</p>
                    <p className="text-sm text-gray-600">{trainer.specialization}</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  {trainer.courses.length} courses
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        
        <GlassCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Recent Students</h3>
            <Link to="/students" className="text-sm text-primary hover:underline">
              View All
            </Link>
          </div>
          
          <div className="space-y-4">
            {students.map((student) => (
              <div 
                key={student.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/50"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                    <img
                      src={student.photo || `https://i.pravatar.cc/40?img=${parseInt(student.id)}`}
                      alt={student.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{student.name}</p>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                <Link 
                  to={`/students/${student.id}`}
                  className="text-sm text-primary hover:underline"
                >
                  Details
                </Link>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      
      {/* Add TrainerForm component */}
      <TrainerForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        editTrainerId={undefined}
      />
    </div>
  );
}
