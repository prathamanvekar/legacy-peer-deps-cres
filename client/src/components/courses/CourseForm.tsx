
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { mockCourses, Material } from '@/utils/mockData';
import { X, Upload } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  editCourse?: any;
}

export function CourseForm({ open, onClose, editCourse }: CourseFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState(editCourse?.title || '');
  const [description, setDescription] = useState(editCourse?.description || '');
  const [materials, setMaterials] = useState<Material[]>(
    editCourse?.materials || []
  );
  
  // Fixed the type definition here to match the Material interface
  const [newMaterial, setNewMaterial] = useState<{
    title: string;
    type: 'ppt' | 'pdf' | 'doc';
    isReleased: boolean;
  }>({
    title: '',
    type: 'ppt',
    isReleased: false
  });

  const handleAddMaterial = () => {
    if (!newMaterial.title) {
      toast.error("Material title is required");
      return;
    }
    
    // Create new material with required properties
    const newMaterialItem: Material = {
      id: Math.random().toString(36).substring(7),
      title: newMaterial.title,
      type: newMaterial.type,
      url: '#', // Placeholder URL
      isReleased: newMaterial.isReleased,
      uploadDate: new Date().toISOString()
    };
    
    setMaterials([...materials, newMaterialItem]);
    
    // Reset the form
    setNewMaterial({
      title: '',
      type: 'ppt',
      isReleased: false
    });
  };

  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = [...materials];
    updatedMaterials.splice(index, 1);
    setMaterials(updatedMaterials);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!title) {
      toast.error("Course title is required");
      setIsSubmitting(false);
      return;
    }
    
    // Simulate API call delay
    setTimeout(() => {
      if (editCourse) {
        // Update existing course
        const courseIndex = mockCourses.findIndex(c => c.id === editCourse.id);
        if (courseIndex !== -1) {
          mockCourses[courseIndex] = {
            ...mockCourses[courseIndex],
            title,
            description,
            materials
          };
          toast.success("Course updated successfully");
        }
      } else {
        // Add new course
        const newCourse = {
          id: (mockCourses.length + 1).toString(),
          title,
          description,
          materials,
          createdAt: new Date().toISOString(),
          trainerId: user?.id || ''
        };
        mockCourses.push(newCourse);
        toast.success("Course created successfully");
      }
      
      setIsSubmitting(false);
      onClose();
      navigate('/courses');
    }, 1000);
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>{editCourse ? 'Edit Course' : 'Create New Course'}</SheetTitle>
        </SheetHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Course Title
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter course title"
                className="mt-1"
              />
            </label>
            
            <label className="text-sm font-medium">
              Description
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter course description"
                className="mt-1"
                rows={4}
              />
            </label>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">Course Materials</label>
              
              {materials.length > 0 && (
                <div className="space-y-2">
                  {materials.map((material, index) => (
                    <div 
                      key={index}
                      className="flex items-center justify-between p-3 bg-white/50 rounded-md"
                    >
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-xs text-gray-500">Type: {material.type.toUpperCase()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          material.isReleased 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {material.isReleased ? 'Released' : 'Not Released'}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveMaterial(index)}
                          className="text-red-500 p-1"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <GlassCard className="p-3">
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <Input
                      placeholder="Material title"
                      value={newMaterial.title}
                      onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
                    />
                    <select
                      className="w-24 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      value={newMaterial.type}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial, 
                        type: e.target.value as 'ppt' | 'pdf' | 'doc'
                      })}
                    >
                      <option value="ppt">PPT</option>
                      <option value="pdf">PDF</option>
                      <option value="doc">DOC</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isReleased"
                      checked={newMaterial.isReleased}
                      onChange={(e) => setNewMaterial({
                        ...newMaterial, 
                        isReleased: e.target.checked
                      })}
                      className="h-4 w-4"
                    />
                    <label htmlFor="isReleased" className="text-sm">
                      Release immediately
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <Button 
                      type="button" 
                      onClick={handleAddMaterial}
                      variant="outline"
                      className="w-full"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Add Material
                    </Button>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : editCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
