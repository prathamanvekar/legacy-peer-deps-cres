
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface TrainerDashboardHeaderProps {
  onCreateCourse: () => void;
}

export function TrainerDashboardHeader({ onCreateCourse }: TrainerDashboardHeaderProps) {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-medium">Trainer Dashboard</h1>
      <div className="flex gap-3">
        <Button 
          onClick={onCreateCourse}
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
  );
}
