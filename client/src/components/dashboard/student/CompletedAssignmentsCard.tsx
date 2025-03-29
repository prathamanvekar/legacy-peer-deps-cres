
import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { CheckCircle } from 'lucide-react';
import { Assignment } from '@/utils/mockData';
import { useAuth } from '@/contexts/AuthContext';

interface CompletedAssignmentsCardProps {
  assignments: Assignment[];
}

export function CompletedAssignmentsCard({ assignments }: CompletedAssignmentsCardProps) {
  const { user } = useAuth();
  
  const completedCount = assignments.filter(a => 
    a.submissions.some(s => s.studentId === user?.id)
  ).length;
  
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-green-100">
          <CheckCircle className="h-5 w-5 text-green-500" />
        </div>
        <h3 className="font-medium">Completed</h3>
      </div>
      <p className="text-3xl font-medium mb-1">{completedCount}</p>
      <p className="text-sm text-gray-600 mb-3">Submitted assignments</p>
      <Link 
        to="/assignments?filter=completed" 
        className="mt-auto text-sm text-primary hover:underline"
      >
        View submissions
      </Link>
    </GlassCard>
  );
}
