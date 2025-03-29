
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { PageTransition } from '@/components/common/Transition';

const SignUp = () => {
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    // Add a class to the body for the sign-up page
    document.body.classList.add('signup-page');
    
    // Clean up on unmount
    return () => {
      document.body.classList.remove('signup-page');
    };
  }, []);
  
  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white">
      <PageTransition>
        <div className="w-full max-w-md">
          <SignUpForm />
          <p className="text-center text-sm text-gray-500 mt-8">
            CloudLectures Portal — Student Registration System
          </p>
        </div>
      </PageTransition>
    </div>
  );
};

export default SignUp;
