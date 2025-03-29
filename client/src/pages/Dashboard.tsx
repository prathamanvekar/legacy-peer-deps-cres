
import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AdminDashboard } from '@/components/dashboard/AdminDashboard';
import { TrainerDashboard } from '@/components/dashboard/TrainerDashboard';
import { StudentDashboard } from '@/components/dashboard/StudentDashboard';

const Dashboard = () => {
  const { user } = useAuth();
  
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'trainer':
        return <TrainerDashboard />;
      case 'student':
        return <StudentDashboard />;
      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl mb-2">Welcome!</h2>
            <p className="text-gray-600">
              Please contact an administrator if you're having trouble accessing your dashboard.
            </p>
          </div>
        );
    }
  };
  
  return (
    <DashboardLayout>
      {renderDashboard()}
    </DashboardLayout>
  );
};

export default Dashboard;
