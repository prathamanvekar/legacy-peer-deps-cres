
import React from 'react';
import { Link } from 'react-router-dom';
import { GlassCard } from '@/components/ui/glass-card';
import { BookOpen } from 'lucide-react';
import { Course } from '@/utils/mockData';
import { SmartSummarizer } from '@/components/materials/SmartSummarizer';

interface CourseMaterialsListProps {
  courses: Course[];
}

export function CourseMaterialsList({ courses }: CourseMaterialsListProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Course Materials</h3>
        <Link to="/courses" className="text-sm text-primary hover:underline">
          All Courses
        </Link>
      </div>
      
      <div className="space-y-4">
        {courses.map((course) => {
          const releasedMaterials = course.materials.filter(m => m.isReleased);
          
          return (
            <div
              key={course.id}
              className="p-4 rounded-lg bg-white/50 hover:bg-white/70 transition-colors"
            >
              <h4 className="font-medium mb-3">{course.title}</h4>
              
              {releasedMaterials.length > 0 ? (
                <div className="space-y-2">
                  {releasedMaterials.map((material) => (
                    <div
                      key={material.id}
                      className="flex flex-col bg-white/70 p-2 rounded"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{material.title}</span>
                        </div>
                        <Link
                          to={material.url}
                          className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded hover:bg-blue-100 transition-colors"
                        >
                          View
                        </Link>
                      </div>
                      
                      <SmartSummarizer 
                        materialId={material.id} 
                        materialTitle={material.title} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No materials available yet.</p>
              )}
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
