
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { mockTrainers, mockCourses } from '@/utils/mockData';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { TrainerForm } from '@/components/trainers/TrainerForm';

export default function TrainerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formOpen, setFormOpen] = useState(false);
  
  const isAdmin = user?.role === 'admin';
  
  // Get trainer data
  const trainer = mockTrainers.find(trainer => trainer.id === id);
  
  // Get courses for this trainer
  const trainerCourses = mockCourses.filter(course => course.trainerId === id);

  useEffect(() => {
    if (!trainer) {
      navigate('/trainers');
    }
  }, [trainer, navigate]);

  if (!trainer) {
    return null;
  }
  
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/trainers')}
          className="flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Trainers
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <div className="w-full md:w-1/3">
          <div className="glass-card p-6">
            <div className="flex flex-col items-center mb-6">
              <div className="h-32 w-32 rounded-full overflow-hidden bg-gray-100 mb-4">
                <img
                  src={`https://i.pravatar.cc/128?img=${parseInt(trainer.id) + 10}`}
                  alt={trainer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h1 className="text-2xl font-medium text-center">{trainer.name}</h1>
              <p className="text-muted-foreground text-center">{trainer.specialization}</p>
              
              {isAdmin && (
                <Button 
                  onClick={() => setFormOpen(true)}
                  className="mt-4"
                  size="sm"
                >
                  Edit Profile
                </Button>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p>{trainer.email}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Courses</h3>
                <p>{trainer.courses.length} active courses</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3">
          <h2 className="text-xl font-medium mb-4">Courses</h2>
          
          {trainerCourses.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {trainerCourses.map((course) => (
                <div 
                  key={course.id}
                  className="glass-card hover:shadow-lg transition-shadow"
                >
                  <div className="flex justify-between mb-2">
                    <h3 className="text-lg font-medium">{course.title}</h3>
                    <span className="text-sm text-muted-foreground">
                      {course.materials.length} materials
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description.length > 150 
                      ? `${course.description.substring(0, 150)}...` 
                      : course.description}
                  </p>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    View Course
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card text-center py-8">
              <p className="text-muted-foreground">No courses found for this trainer.</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Trainer Form */}
      <TrainerForm 
        open={formOpen} 
        onClose={() => setFormOpen(false)}
        editTrainerId={id}
      />
    </div>
  );
}
