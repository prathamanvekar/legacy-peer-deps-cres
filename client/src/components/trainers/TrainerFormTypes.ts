import * as z from 'zod';

// Form validation schema
export const trainerFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  expertise: z.array(z.string()).nonempty({ message: 'At least one expertise is required' }), // ✅ Updated from `specialization` to `expertise`
  contactNumber: z.string().min(10, { message: 'Contact number must be at least 10 digits' }), // ✅ Now required, added validation
});

export type TrainerFormValues = z.infer<typeof trainerFormSchema>;

// Update the Trainer type in mockData to include the fields we're using
export interface Trainer {
  id: string;
  name: string;
  email: string;
  password: string; // ✅ Added for consistency
  expertise: string[]; // ✅ Updated from `specialization` to `expertise`
  contactNumber: string; // ✅ Now required
  assignedCourses: string[]; // ✅ Renamed `courses` to `assignedCourses`
  createdAt: Date; // ✅ Added for consistency with the database model
}
