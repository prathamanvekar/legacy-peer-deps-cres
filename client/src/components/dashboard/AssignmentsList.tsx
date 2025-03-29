
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Assignment } from '@/utils/mockData';

interface AssignmentsListProps {
  assignments: Assignment[];
  onCreateAssignment: () => void;
  formatDate: (dateString: string) => string;
}

export function AssignmentsList({ assignments, onCreateAssignment, formatDate }: AssignmentsListProps) {
  const navigate = useNavigate();
  
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Upcoming Deadlines</h3>
        <Button 
          onClick={() => navigate('/assignments')}
          variant="link"
          size="sm"
        >
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {assignments.length > 0 ? (
          assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{assignment.title}</h4>
                <div className="flex items-center gap-1 text-amber-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">
                    Due {formatDate(assignment.dueDate)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {assignment.description.substring(0, 80)}
                {assignment.description.length > 80 ? '...' : ''}
              </p>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Submissions: {assignment.submissions.length}
                </span>
                <Button
                  onClick={() => navigate(`/assignments/${assignment.id}`)}
                  variant="link"
                  size="sm"
                  className="text-primary p-0 h-auto"
                >
                  View Details
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No assignments yet.</p>
            <Button 
              onClick={onCreateAssignment}
              variant="link"
              className="mt-2"
            >
              Create your first assignment
            </Button>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
