
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockTrainers } from '@/utils/mockData';
import { TrainerFormContent } from './TrainerFormContent';
import { TrainerFormValues } from './TrainerFormTypes';

interface TrainerFormProps {
  open: boolean;
  onClose: () => void;
  editTrainerId?: string;
}

export function TrainerForm({ open, onClose, editTrainerId }: TrainerFormProps) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Get trainer data if editing
  const editTrainer = editTrainerId ? mockTrainers.find(trainer => trainer.id === editTrainerId) : undefined;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (values: TrainerFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      console.log('Submitting trainer data:', values);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Add new trainer to mock data
      if (!editTrainerId) {
        const newTrainer = {
          id: (mockTrainers.length + 1).toString(),
          name: values.name,
          username: values.username,
          email: values.email,
          specialization: values.specialization,
          bio: values.bio || '',
          contactNumber: values.contactNumber || '',
          courses: [],
        };
        
        mockTrainers.push(newTrainer);
      } else {
        // Update existing trainer
        const trainerIndex = mockTrainers.findIndex(trainer => trainer.id === editTrainerId);
        if (trainerIndex !== -1) {
          mockTrainers[trainerIndex] = {
            ...mockTrainers[trainerIndex],
            name: values.name,
            username: values.username,
            email: values.email,
            specialization: values.specialization,
            bio: values.bio || '',
            contactNumber: values.contactNumber || '',
          };
        }
      }
      
      toast({
        title: editTrainerId ? 'Trainer Updated' : 'Trainer Added',
        description: editTrainerId 
          ? `${values.name} has been updated successfully.` 
          : `${values.name} has been added to trainers.`,
      });
      
      onClose();
      navigate('/trainers');
    } catch (error) {
      console.error('Error submitting trainer form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save trainer. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{editTrainerId ? 'Edit Trainer' : 'Add New Trainer'}</SheetTitle>
          <SheetDescription>
            {editTrainerId 
              ? 'Update trainer information in the system.' 
              : 'Add a new trainer to the system. They will be able to create and manage courses.'}
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <TrainerFormContent 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting} 
            editTrainer={editTrainer} 
            editTrainerId={editTrainerId}
            onClose={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
