
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';

// Form validation schema
const formSchema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

type LoginFormValues = z.infer<typeof formSchema>;

export function LoginForm() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });
  
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      const success = await login(values.username, values.password);
      
      if (success) {
        toast({
          title: 'Login Successful',
          description: 'Welcome to the CloudLectures portal.',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid username or password.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error logging in:', error);
      toast({
        title: 'Login Error',
        description: 'An error occurred while logging in.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <GlassCard className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">CloudLectures</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access the portal
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Enter your password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Use these demo accounts:
          </p>
          <div className="grid grid-cols-3 gap-2 mt-2 text-xs text-gray-500">
            <div className="p-1 border rounded">
              <p className="font-medium">Admin</p>
              <p>username: admin</p>
              <p>password: any</p>
            </div>
            <div className="p-1 border rounded">
              <p className="font-medium">Trainer</p>
              <p>username: trainer</p>
              <p>password: any</p>
            </div>
            <div className="p-1 border rounded">
              <p className="font-medium">Student</p>
              <p>username: student</p>
              <p>password: any</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up as a student
          </Link>
        </div>
      </CardFooter>
    </GlassCard>
  );
}
