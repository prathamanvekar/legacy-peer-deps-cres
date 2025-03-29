
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil } from 'lucide-react';
import { mockTrainers } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { TrainerForm } from '@/components/trainers/TrainerForm';

export default function Trainers() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trainers] = useState(mockTrainers);
  const [formOpen, setFormOpen] = useState(false);
  const [editTrainerId, setEditTrainerId] = useState<string | undefined>(undefined);
  
  const isAdmin = user?.role === 'admin';
  
  const openAddForm = () => {
    setEditTrainerId(undefined);
    setFormOpen(true);
  };
  
  const openEditForm = (trainerId: string) => {
    setEditTrainerId(trainerId);
    setFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setFormOpen(false);
    setEditTrainerId(undefined);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-medium">Trainers</h1>
        {isAdmin && (
          <Button 
            onClick={openAddForm}
            className="flex items-center gap-1"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add New Trainer
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div 
            key={trainer.id}
            className="glass-card hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between mb-4">
              <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={`https://i.pravatar.cc/64?img=${parseInt(trainer.id) + 10}`}
                  alt={trainer.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {isAdmin && (
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => openEditForm(trainer.id)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <h3 className="text-xl font-medium mb-1">{trainer.name}</h3>
            <p className="text-muted-foreground text-sm mb-2">{trainer.specialization}</p>
            <p className="text-sm mb-4">{trainer.email}</p>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="text-sm text-gray-600">
                {trainer.courses.length} course{trainer.courses.length !== 1 ? 's' : ''}
              </div>
              <Link
                to={`/trainers/${trainer.id}`}
                className="text-primary text-sm font-medium hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {/* Trainer Form */}
      <TrainerForm 
        open={formOpen} 
        onClose={handleCloseForm}
        editTrainerId={editTrainerId}
      />
    </div>
  );
}
