
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { mockTrainers } from '@/utils/mockData';

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  specialization: z.string().min(2, { message: 'Specialization is required' }),
  bio: z.string().optional(),
  contactNumber: z.string().optional(),
});

type TrainerFormValues = z.infer<typeof formSchema>;

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
  
  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editTrainer?.name || '',
      email: editTrainer?.email || '',
      specialization: editTrainer?.specialization || '',
      bio: '',
      contactNumber: '',
    },
  });
  
  // Reset form when editTrainerId changes
  useEffect(() => {
    if (editTrainer) {
      form.reset({
        name: editTrainer.name,
        email: editTrainer.email,
        specialization: editTrainer.specialization,
        bio: '',
        contactNumber: '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        specialization: '',
        bio: '',
        contactNumber: '',
      });
    }
  }, [editTrainer, form]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const onSubmit = async (values: TrainerFormValues) => {
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
          email: values.email,
          specialization: values.specialization,
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
            email: values.email,
            specialization: values.specialization,
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter trainer's full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="trainer@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Web Development, Data Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Brief description of trainer's background and expertise" 
                        {...field} 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Optional contact number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2 pt-4">
                <SheetClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </SheetClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editTrainerId ? 'Update Trainer' : 'Add Trainer'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
