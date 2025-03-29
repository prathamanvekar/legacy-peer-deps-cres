
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { GlassButton, GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(username, password);
      
      if (success) {
        toast.success('Logged in successfully');
        navigate('/dashboard');
      } else {
        toast.error('Invalid username or password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <GlassCard className="w-full max-w-md mx-auto p-8">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-medium mb-1">CloudLectures</h2>
        <p className="text-gray-600">Sign in to your account</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label 
            htmlFor="username" 
            className="block text-sm font-medium mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="admin, trainer, or student"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={isLoading}
          />
        </div>
        
        <div>
          <label 
            htmlFor="password" 
            className="block text-sm font-medium mb-1"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Any password works for demo"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/30"
            disabled={isLoading}
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <span className="loader mr-2"></span>
              Signing in...
            </span>
          ) : (
            'Sign in'
          )}
        </button>
      </form>
      
      <div className="mt-6 pt-5 border-t border-gray-200 text-sm text-gray-500 text-center">
        <p>
          Demo accounts: <span className="font-medium">admin</span>, <span className="font-medium">trainer</span>, <span className="font-medium">student</span>
        </p>
        <p className="mt-1">
          Any password will work for this demo
        </p>
      </div>
    </GlassCard>
  );
}
