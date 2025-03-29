import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SheetClose } from '@/components/ui/sheet';
import { TrainerFormValues, trainerFormSchema, Trainer } from './TrainerFormTypes';

interface TrainerFormContentProps {
  onSubmit: (values: TrainerFormValues) => Promise<void>;
  isSubmitting: boolean;
  editTrainer?: Trainer;
  editTrainerId?: string;
  onClose: () => void;
}

export function TrainerFormContent({ 
  onSubmit, 
  isSubmitting, 
  editTrainer, 
  editTrainerId,
  onClose 
}: TrainerFormContentProps) {
  const form = useForm<TrainerFormValues>({
    resolver: zodResolver(trainerFormSchema),
    defaultValues: {
      name: editTrainer?.name || '',
      password: '',
      email: editTrainer?.email || '',
      expertise: editTrainer?.expertise || [],
      contactNumber: editTrainer?.contactNumber || '',
    },
  });

  // Reset form when editTrainerId changes or when modal opens/closes
  useEffect(() => {
    form.reset({
      name: editTrainer?.name || '',
      password: '', // Always reset password field
      email: editTrainer?.email || '',
      expertise: editTrainer?.expertise || [],
      contactNumber: editTrainer?.contactNumber || '',
    });
  }, [editTrainerId]); // ✅ Only reset when trainer changes

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields control={form.control} />
        <CredentialsFields control={form.control} editTrainerId={editTrainerId} />
        <ExpertiseFields control={form.control} />
        <ContactInfoFields control={form.control} />
        
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
  );
}

// Basic information fields component
function BasicInfoFields({ control }: { control: any }) {
  return (
    <FormField
      control={control}
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
  );
}

// Credentials fields component (✅ FIXED ISSUE)
function CredentialsFields({ control, editTrainerId }: { control: any, editTrainerId?: string }) {
  return (
    <>
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{editTrainerId ? 'New Password (leave empty to keep current)' : 'Password'}</FormLabel>
            <FormControl>
              <Input 
                type="password" 
                placeholder="Enter password"
                {...field}
                value={field.value ?? ''} // ✅ Prevents uncontrolled input issue
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input 
                type="email" 
                placeholder="trainer@example.com"
                {...field}
                value={field.value ?? ''} // ✅ Prevents uncontrolled input issue
                onChange={(e) => field.onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// Expertise fields component (Handles multiple expertise values)
function ExpertiseFields({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="expertise"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Expertise</FormLabel>
          <FormControl>
            <Input 
              placeholder="e.g., Web Development, Data Science" 
              value={field.value?.join(', ') || ''} // ✅ Ensures controlled input
              onChange={(e) => field.onChange(e.target.value.split(',').map((s) => s.trim()))} // ✅ Fix binding
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

// Contact information fields component
function ContactInfoFields({ control }: { control: any }) {
  return (
    <FormField
      control={control}
      name="contactNumber"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Contact Number</FormLabel>
          <FormControl>
            <Input 
              placeholder="Enter contact number" 
              {...field}
              value={field.value ?? ''} // ✅ Prevents uncontrolled input issue
              onChange={(e) => field.onChange(e.target.value)}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
