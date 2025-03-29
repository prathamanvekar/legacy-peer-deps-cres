
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AdminDashboardHeaderProps {
  onAddTrainer: () => void;
}

export function AdminDashboardHeader({ onAddTrainer }: AdminDashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-3xl font-medium">Admin Dashboard</h1>
      <Button 
        onClick={onAddTrainer}
        className="flex items-center gap-1"
        size="sm"
      >
        <Plus className="h-4 w-4" />
        Add New Trainer
      </Button>
    </div>
  );
}
