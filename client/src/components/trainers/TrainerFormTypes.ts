
import * as z from 'zod';

// Form validation schema
export const trainerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  username: z.string().min(3, { message: 'Username must be at least 3 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  specialization: z.string().min(2, { message: 'Specialization is required' }),
  bio: z.string().optional(),
  contactNumber: z.string().optional(),
});

export type TrainerFormValues = z.infer<typeof trainerFormSchema>;

// Update the Trainer type in mockData to include the fields we're using
export interface Trainer {
  id: string;
  name: string;
  username?: string;
  email: string;
  specialization: string;
  bio?: string;
  contactNumber?: string;
  courses: string[];
}
