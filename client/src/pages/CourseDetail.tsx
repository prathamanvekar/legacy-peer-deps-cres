
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, mockStudents } from '@/utils/mockData';
import { BookOpen, Calendar, Clock, FileText, Settings, Users } from 'lucide-react';
import { SmartSummarizer } from '@/components/materials/SmartSummarizer';
import { CourseAIChatbot } from '@/components/chatbot/CourseAIChatbot';
import { toast } from 'sonner';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const foundCourse = mockCourses.find(c => c.id === id);
      if (foundCourse) {
        setCourse(foundCourse);
      }
      setLoading(false);
    }, 500);
  }, [id]);
  
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <p className="text-gray-500">Loading course details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }
  
  if (!course) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl mb-2">Course Not Found</h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </div>
      </DashboardLayout>
    );
  }
  
  const isTrainerOrAdmin = user?.role === 'admin' || (user?.role === 'trainer' && course.trainerId === user?.id);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const handleReleaseMaterial = (materialId: string) => {
    // Update the course materials
    const updatedCourse = { ...course };
    const materialIndex = updatedCourse.materials.findIndex((m: any) => m.id === materialId);
    
    if (materialIndex !== -1) {
      updatedCourse.materials[materialIndex].isReleased = true;
      setCourse(updatedCourse);
      
      // Update in mock data
      const courseIndex = mockCourses.findIndex(c => c.id === course.id);
      if (courseIndex !== -1) {
        mockCourses[courseIndex] = updatedCourse;
      }
      
      toast.success("Material released successfully");
    }
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-medium">{course.title}</h1>
            <p className="text-gray-600 mt-1">Created: {formatDate(course.createdAt)}</p>
          </div>
          
          {isTrainerOrAdmin && (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/courses/${course.id}/edit`)}
                variant="outline"
              >
                Edit Course
              </Button>
              <Button
                onClick={() => navigate(`/courses/${course.id}/materials`)}
              >
                Manage Materials
              </Button>
            </div>
          )}
        </div>
        
        <GlassCard>
          <h2 className="text-xl font-medium mb-4">Course Overview</h2>
          <p className="text-gray-600 mb-6">{course.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-blue-100">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Materials</p>
                <p className="font-medium">{course.materials.length} total</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-green-100">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Students</p>
                <p className="font-medium">2 enrolled</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-purple-100">
                <Calendar className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Duration</p>
                <p className="font-medium">4 weeks</p>
              </div>
            </div>
          </div>
        </GlassCard>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <GlassCard>
              <h2 className="text-xl font-medium mb-4">Course Materials</h2>
              
              {course.materials.length > 0 ? (
                <div className="space-y-4">
                  {course.materials.map((material: any) => (
                    <div
                      key={material.id}
                      className={`p-4 rounded-lg ${
                        material.isReleased ? 'bg-white/50' : 'bg-gray-100/50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <FileText className={`h-5 w-5 ${
                            material.isReleased ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                          <h3 className="font-medium">{material.title}</h3>
                        </div>
                        <div>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            material.isReleased 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {material.isReleased ? 'Released' : 'Not Released'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-4">
                        <div className="text-sm text-gray-500">
                          {material.type.toUpperCase()} • Added on {formatDate(material.uploadDate || course.createdAt)}
                        </div>
                        
                        <div className="flex gap-2">
                          {material.isReleased ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(material.url || '#')}
                            >
                              View Material
                            </Button>
                          ) : isTrainerOrAdmin ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReleaseMaterial(material.id)}
                            >
                              Release Now
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled
                            >
                              Not Available Yet
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {material.isReleased && user?.role === 'student' && (
                        <div className="mt-3 border-t pt-3">
                          <SmartSummarizer
                            materialId={material.id}
                            materialTitle={material.title}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                  <p className="text-gray-500">No materials available yet.</p>
                </div>
              )}
            </GlassCard>
          </div>
          
          <div>
            <GlassCard>
              <h2 className="text-xl font-medium mb-4">Course Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trainer</h3>
                  <p className="font-medium">Trainer User</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Schedule</h3>
                  <p className="font-medium">Monday, Wednesday, Friday</p>
                  <p className="text-sm text-gray-500">10:00 AM - 12:00 PM</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Location</h3>
                  <p className="font-medium">Online (Zoom)</p>
                </div>
                
                {user?.role === 'student' && (
                  <div className="pt-4 mt-4 border-t">
                    <Button className="w-full" variant="default">
                      Contact Trainer
                    </Button>
                  </div>
                )}
                
                {isTrainerOrAdmin && (
                  <div className="pt-4 mt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Enrolled Students</h3>
                    
                    {mockStudents.map((student) => (
                      <div 
                        key={student.id}
                        className="flex items-center gap-2 mb-2 p-2 hover:bg-gray-50 rounded"
                      >
                        <div className="h-8 w-8 rounded-full overflow-hidden">
                          <img 
                            src={student.photo || `https://i.pravatar.cc/32?img=${parseInt(student.id)}`} 
                            alt={student.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    ))}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={() => navigate(`/courses/${course.id}/students`)}
                    >
                      Manage Students
                    </Button>
                  </div>
                )}
              </div>
            </GlassCard>
            
            {/* AI Chatbot - only show for students */}
            {user?.role === 'student' && (
              <div className="mt-6">
                <CourseAIChatbot courseId={course.id} courseTitle={course.title} />
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CourseDetail;
