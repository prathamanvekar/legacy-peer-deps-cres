
import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { Calendar, FileText, Upload } from 'lucide-react';
import { Assignment } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { DeadlineReminder } from '@/components/assignments/DeadlineReminder';

interface PendingAssignmentsListProps {
  assignments: Assignment[];
  formatDate: (dateString: string) => string;
  isDueSoon: (dueDate: string) => boolean;
}

export function PendingAssignmentsList({ 
  assignments, 
  formatDate, 
  isDueSoon 
}: PendingAssignmentsListProps) {
  const { user } = useAuth();
  
  const getAssignmentStatus = (assignmentId: string) => {
    const assignment = assignments.find(a => a.id === assignmentId);
    if (!assignment) return 'pending';
    
    const submission = assignment.submissions.find(s => s.studentId === user?.id);
    return submission ? 'submitted' : 'pending';
  };
  
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Pending Assignments</h3>
        <Link to="/assignments" className="text-sm text-primary hover:underline">
          All Assignments
        </Link>
      </div>
      
      <div className="space-y-4">
        {assignments.map((assignment) => {
          const status = getAssignmentStatus(assignment.id);
          const dueSoon = isDueSoon(assignment.dueDate);
          const isSubmitted = status === 'submitted';
          
          return (
            <div
              key={assignment.id}
              className={`p-4 rounded-lg ${
                isSubmitted 
                  ? 'bg-green-50/70' 
                  : dueSoon 
                    ? 'bg-amber-50/70' 
                    : 'bg-white/50'
              } hover:bg-opacity-80 transition-colors`}
            >
              <div className="flex justify-between mb-2">
                <h4 className="font-medium">{assignment.title}</h4>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className={`text-xs ${
                    dueSoon ? 'text-amber-600 font-medium' : 'text-gray-500'
                  }`}>
                    Due {formatDate(assignment.dueDate)}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">
                {assignment.description.substring(0, 60)}
                {assignment.description.length > 60 ? '...' : ''}
              </p>
              
              <DeadlineReminder 
                dueDate={assignment.dueDate}
                title={assignment.title}
                id={assignment.id}
                isSubmitted={isSubmitted}
              />
              
              <div className="flex justify-between items-center mt-2">
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  isSubmitted 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {isSubmitted ? 'Submitted' : 'Pending'}
                </span>
                
                <Link
                  to={`/assignments/${assignment.id}`}
                  className="flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {isSubmitted ? (
                    <>View Submission</>
                  ) : (
                    <>
                      <Upload className="h-3 w-3" />
                      Upload
                    </>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
        
        {assignments.length === 0 && (
          <div className="text-center py-6 text-gray-500">
            <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
            <p>No assignments pending.</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
