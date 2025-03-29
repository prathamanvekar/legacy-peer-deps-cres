import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { GlassCard } from '@/components/ui/glass-card';
import { 
  Calendar, 
  Edit, 
  FileText, 
  Mail, 
  Phone, 
  User
} from 'lucide-react';
import { mockAssignments, mockStudents } from '@/utils/mockData';
import { toast } from 'sonner';
import { ResumeUpload } from '@/components/student/ResumeUpload';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // For student users, get more details
  const studentDetails = user?.role === 'student'
    ? mockStudents.find(s => s.id === user.id)
    : null;
  
  // Get student submissions
  const studentSubmissions = user?.role === 'student'
    ? mockAssignments.flatMap(a => 
        a.submissions.filter(s => s.studentId === user.id)
          .map(s => ({ ...s, assignment: a }))
      )
    : [];
  
  const handleEdit = () => {
    setIsEditing(true);
    toast.info("Profile editing is available in the full version");
  };
  
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-medium">Profile</h1>
          
          <button 
            onClick={handleEdit}
            className="flex items-center gap-1 glass-button"
          >
            <Edit className="h-4 w-4" />
            Edit Profile
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <GlassCard className="text-center">
              <div className="h-24 w-24 rounded-full overflow-hidden mx-auto mb-4 border-2 border-white">
                <img 
                  src={user?.avatar || 'https://i.pravatar.cc/96'} 
                  alt={user?.name || 'User'}
                  className="h-full w-full object-cover"
                />
              </div>
              
              <h2 className="text-2xl font-medium mb-1">{user?.name}</h2>
              <p className="text-gray-600 capitalize mb-4">{user?.role}</p>
              
              <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mb-2">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
              
              {(user?.contactNumber || studentDetails?.contactNumber) && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{user?.contactNumber || studentDetails?.contactNumber}</span>
                </div>
              )}
              
              {user?.role === 'student' && (
                <ResumeUpload />
              )}
            </GlassCard>
            
            {user?.role === 'student' && (user?.parentName || studentDetails?.parentName) && (
              <GlassCard className="mt-6">
                <h3 className="font-medium mb-4">Parent Information</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Parent Name</p>
                      <p className="font-medium">{user?.parentName || studentDetails?.parentName}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Parent Contact</p>
                      <p className="font-medium">{user?.parentContactNumber || studentDetails?.parentContactNumber}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )}
          </div>
          
          <div className="lg:col-span-2">
            {user?.role === 'student' && (
              <GlassCard>
                <h3 className="font-medium mb-4">Assignment History</h3>
                
                {studentSubmissions.length > 0 ? (
                  <div className="space-y-4">
                    {studentSubmissions.map((submission) => (
                      <div
                        key={submission.id}
                        className="p-3 bg-white/60 rounded-lg hover:bg-white/80 transition-colors"
                      >
                        <div className="flex justify-between mb-1">
                          <h4 className="font-medium">{submission.assignment.title}</h4>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                            {submission.grade ? `Grade: ${submission.grade}/100` : 'Submitted'}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            <a href={submission.fileUrl} className="text-primary hover:underline">
                              View Submission
                            </a>
                          </div>
                        </div>
                        
                        {submission.feedback && (
                          <div className="mt-2 text-sm bg-gray-50 p-2 rounded">
                            <span className="font-medium">Feedback:</span> {submission.feedback}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                    <p>No submissions yet.</p>
                  </div>
                )}
              </GlassCard>
            )}
            
            {user?.role === 'trainer' && (
              <GlassCard>
                <h3 className="font-medium mb-4">Trainer Stats</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">2</div>
                    <div className="text-gray-600">Active Courses</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">15</div>
                    <div className="text-gray-600">Total Students</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">24</div>
                    <div className="text-gray-600">Materials Uploaded</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">18</div>
                    <div className="text-gray-600">Assignments Created</div>
                  </div>
                </div>
              </GlassCard>
            )}
            
            {user?.role === 'admin' && (
              <GlassCard>
                <h3 className="font-medium mb-4">System Overview</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">25</div>
                    <div className="text-gray-600">Total Users</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">8</div>
                    <div className="text-gray-600">Active Courses</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">120</div>
                    <div className="text-gray-600">Material Downloads</div>
                  </div>
                  
                  <div className="p-4 bg-white/60 rounded-lg">
                    <div className="text-3xl font-medium mb-1">95%</div>
                    <div className="text-gray-600">Assignment Completion</div>
                  </div>
                </div>
              </GlassCard>
            )}
            
            <GlassCard className="mt-6">
              <h3 className="font-medium mb-4">Account Information</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                    <input
                      type="text"
                      readOnly={!isEditing}
                      className="w-full px-3 py-2 bg-white/60 border border-gray-200 rounded-lg"
                      value={user?.name}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input
                      type="email"
                      readOnly={!isEditing}
                      className="w-full px-3 py-2 bg-white/60 border border-gray-200 rounded-lg"
                      value={user?.email}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Role</label>
                  <input
                    type="text"
                    readOnly
                    className="w-full px-3 py-2 bg-white/60 border border-gray-200 rounded-lg capitalize"
                    value={user?.role}
                  />
                </div>
                
                {isEditing && (
                  <div className="flex justify-end gap-3 mt-4">
                    <button 
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => {
                        setIsEditing(false);
                        toast.success("Profile updated successfully");
                      }}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
