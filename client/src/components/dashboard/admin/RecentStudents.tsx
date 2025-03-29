
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Student } from '@/utils/mockData';

interface RecentStudentsProps {
  students: Student[];
}

export function RecentStudents({ students }: RecentStudentsProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Recent Students</h3>
        <Link to="/students" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      
      <div className="space-y-4">
        {students.length > 0 ? students.map((student) => (
          <div 
            key={student.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/50"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={student.photo || `https://i.pravatar.cc/40?img=${parseInt(student.id)}`}
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="font-medium">{student.name}</p>
                <p className="text-sm text-gray-600">{student.email}</p>
              </div>
            </div>
            <Link 
              to={`/students/${student.id}`}
              className="text-sm text-primary hover:underline"
            >
              Details
            </Link>
          </div>
        )) : (
          <div className="text-center py-6 text-gray-500">
            <p>No students enrolled yet.</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
