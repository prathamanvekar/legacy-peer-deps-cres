
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
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
      username: editTrainer?.username || '',
      password: '',
      email: editTrainer?.email || '',
      specialization: editTrainer?.specialization || '',
      bio: editTrainer?.bio || '',
      contactNumber: editTrainer?.contactNumber || '',
    },
  });
  
  // Reset form when editTrainerId changes or when modal opens/closes
  useEffect(() => {
    if (editTrainer) {
      form.reset({
        name: editTrainer.name,
        username: editTrainer.username || '',
        password: '',
        email: editTrainer.email,
        specialization: editTrainer.specialization,
        bio: editTrainer.bio || '',
        contactNumber: editTrainer.contactNumber || '',
      });
    } else {
      form.reset({
        name: '',
        username: '',
        password: '',
        email: '',
        specialization: '',
        bio: '',
        contactNumber: '',
      });
    }
  }, [editTrainer, form, onClose]);
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <BasicInfoFields control={form.control} />
        <CredentialsFields control={form.control} editTrainerId={editTrainerId} />
        <SpecializationFields control={form.control} />
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

// Credentials fields component
function CredentialsFields({ control, editTrainerId }: { control: any, editTrainerId?: string }) {
  return (
    <>
      <FormField
        control={control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Enter trainer's username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{editTrainerId ? 'New Password (leave empty to keep current)' : 'Password'}</FormLabel>
            <FormControl>
              <Input type="password" placeholder="Enter password" {...field} />
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
              <Input type="email" placeholder="trainer@example.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}

// Specialization fields component
function SpecializationFields({ control }: { control: any }) {
  return (
    <>
      <FormField
        control={control}
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
        control={control}
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
    </>
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
            <Input placeholder="Optional contact number" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
