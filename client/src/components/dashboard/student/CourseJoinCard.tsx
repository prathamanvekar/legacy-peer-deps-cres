
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { BookOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Course } from '@/utils/mockData';

interface CourseJoinCardProps {
  courses: Course[];
}

export function CourseJoinCard({ courses }: CourseJoinCardProps) {
  const [courseCode, setCourseCode] = useState('');
  
  const handleJoinCourse = () => {
    if (!courseCode.trim()) {
      toast.error("Please enter a course code");
      return;
    }
    
    toast.success(`Attempting to join course with code: ${courseCode}`);
  };
  
  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 rounded-full bg-blue-100">
          <BookOpen className="h-5 w-5 text-blue-500" />
        </div>
        <h3 className="font-medium">Courses</h3>
      </div>
      <p className="text-3xl font-medium mb-1">{courses.length}</p>
      <p className="text-sm text-gray-600 mb-3">Enrolled courses</p>
      
      <div className="flex space-x-2 mt-2">
        <Input 
          placeholder="Enter course code" 
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="flex-1"
        />
        <Button 
          onClick={handleJoinCourse}
          variant="default"
        >
          Join
        </Button>
      </div>
      
      <Link 
        to="/courses" 
        className="mt-auto text-sm text-primary hover:underline"
      >
        View courses
      </Link>
    </GlassCard>
  );
}
