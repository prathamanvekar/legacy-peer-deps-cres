import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (values: TrainerFormValues) => {
    setIsSubmitting(true);

    // ✅ Ensure expertise is an array
    if (!Array.isArray(values.expertise)) {
      values.expertise = values.expertise ? values.expertise.split(',').map((e) => e.trim()) : [];
    }

    console.log('📤 Submitting Trainer Data:', values); // ✅ Log data before submission

    try {
      const response = await fetch('http://localhost:5000/api/admin/addtrainer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('❌ API Error:', result);
        throw new Error(result.message || 'Failed to add trainer');
      }

      console.log('✅ Trainer added successfully:', result);

      toast({
        title: 'Trainer Added',
        description: `${values.name} has been successfully added.`,
      });

      onClose();
      navigate('/trainers');
    } catch (error) {
      console.error('❌ Error submitting trainer form:', error);

      toast({
        title: 'Error',
        description: error.message || 'Failed to save trainer. Please try again.',
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
              ? 'Update trainer details in the system.'
              : 'Add a new trainer to the system.'}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <TrainerFormContent
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            editTrainerId={editTrainerId}
            onClose={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
