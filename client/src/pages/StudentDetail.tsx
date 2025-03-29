
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { mockStudents, mockCourses, mockAssignments } from '@/utils/mockData';
import { ChevronLeft, Mail, Phone, User, Users, Trash2, BookOpen, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState(mockStudents.find(s => s.id === id));
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [studentAssignments, setStudentAssignments] = useState([]);
  
  useEffect(() => {
    if (!student) {
      navigate('/dashboard');
      return;
    }
    
    // Find enrolled courses
    const courses = mockCourses.filter(course => 
      course.students.includes(student.id)
    );
    setEnrolledCourses(courses);
    
    // Find assignments for enrolled courses
    const assignments = mockAssignments.filter(assignment =>
      courses.some(course => course.id === assignment.courseId)
    );
    setStudentAssignments(assignments);
  }, [student, navigate]);
  
  const handleRemoveStudent = () => {
    const studentIndex = mockStudents.findIndex(s => s.id === id);
    if (studentIndex !== -1) {
      mockStudents.splice(studentIndex, 1);
      
      toast({
        title: "Student Removed",
        description: `${student?.name} has been removed from the system.`,
      });
      
      navigate('/dashboard');
    }
  };
  
  if (!student) return null;
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-medium">Student Profile</h1>
          
          <div className="ml-auto">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Remove Student
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently remove {student.name} from the system. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveStudent}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-1">
            <div className="flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full overflow-hidden mb-4">
                <img 
                  src={student.photo || `https://i.pravatar.cc/96?img=${parseInt(student.id)}`} 
                  alt={student.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <h2 className="text-xl font-medium">{student.name}</h2>
              <p className="text-gray-600 mb-4">Student ID: {student.id}</p>
              
              <div className="w-full space-y-4 mt-4">
                <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                  <Mail className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{student.email}</p>
                  </div>
                </div>
                
                {student.contactNumber && (
                  <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                    <Phone className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Contact Number</p>
                      <p className="font-medium">{student.contactNumber}</p>
                    </div>
                  </div>
                )}
                
                {student.parentName && (
                  <div className="flex items-center gap-3 bg-white/50 p-3 rounded-lg">
                    <User className="h-5 w-5 text-gray-500" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600">Parent/Guardian</p>
                      <p className="font-medium">{student.parentName}</p>
                      {student.parentContactNumber && (
                        <p className="text-sm text-gray-600">{student.parentContactNumber}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </GlassCard>
          
          <GlassCard className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-4">Enrolled Courses</h3>
            
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.map((course) => {
                  const courseAssignments = studentAssignments.filter(a => a.courseId === course.id);
                  return (
                    <div key={course.id} className="p-4 rounded-lg bg-white/50">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium">{course.title}</h4>
                        <Link 
                          to={`/courses/${course.id}`}
                          className="text-sm text-primary hover:underline"
                        >
                          View Course
                        </Link>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>{course.materials.length} Materials</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FileText className="h-4 w-4" />
                          <span>{courseAssignments.length} Assignments</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{course.description.substring(0, 120)}...</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-10 w-10 mx-auto mb-2 opacity-30" />
                <p>Not enrolled in any courses yet.</p>
              </div>
            )}
          </GlassCard>
        </div>
        
        <GlassCard>
          <h3 className="text-lg font-medium mb-4">Assignment Submissions</h3>
          
          {studentAssignments.length > 0 ? (
            <div className="space-y-4">
              {studentAssignments.map((assignment) => {
                const course = enrolledCourses.find(c => c.id === assignment.courseId);
                const hasSubmitted = assignment.submissions.some(s => s.studentId === student.id);
                
                return (
                  <div 
                    key={assignment.id}
                    className={`p-4 rounded-lg ${hasSubmitted ? 'bg-green-50/70' : 'bg-white/50'}`}
                  >
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{assignment.title}</h4>
                      <div className="text-sm text-gray-600">
                        Due: {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Course: {course?.title || 'Unknown Course'}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className={`text-xs px-2 py-0.5 rounded-full ${
                        hasSubmitted 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {hasSubmitted ? 'Submitted' : 'Pending'}
                      </div>
                      <Link
                        to={`/assignments/${assignment.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
              <p>No assignments assigned yet.</p>
            </div>
          )}
        </GlassCard>
      </div>
    </DashboardLayout>
  );
};

export default StudentDetail;
