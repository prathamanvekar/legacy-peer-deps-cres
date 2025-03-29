
import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { FileText } from 'lucide-react';
import { Assignment } from '@/utils/mockData';

interface AssignmentsCardProps {
  assignments: Assignment[];
}

export function AssignmentsCard({ assignments }: AssignmentsCardProps) {
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-purple-100">
          <FileText className="h-5 w-5 text-purple-500" />
        </div>
        <h3 className="font-medium">Assignments</h3>
      </div>
      <p className="text-3xl font-medium mb-1">{assignments.length}</p>
      <p className="text-sm text-gray-600 mb-3">Total assignments</p>
      <Link 
        to="/assignments" 
        className="mt-auto text-sm text-primary hover:underline"
      >
        View assignments
      </Link>
    </GlassCard>
  );
}
