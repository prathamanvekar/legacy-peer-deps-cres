
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Trainer } from '@/utils/mockData';

interface RecentTrainersProps {
  trainers: Trainer[];
  onAddTrainer: () => void;
}

export function RecentTrainers({ trainers, onAddTrainer }: RecentTrainersProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Trainers</h3>
        <Link to="/trainers" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {trainers.length > 0 ? trainers.map((trainer) => (
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
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600 mr-2">
                {trainer.courses.length} courses
              </div>
              <Link 
                to={`/trainers/${trainer.id}`}
                className="text-sm text-primary hover:underline"
              >
                Details
              </Link>
            </div>
          </div>
        )) : (
          <div className="text-center py-6 text-gray-500">
            <p>No trainers added yet.</p>
            <Button 
              onClick={onAddTrainer}
              variant="link"
              className="mt-2"
            >
              Add your first trainer
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
