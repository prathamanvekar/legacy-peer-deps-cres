import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { toast } from 'sonner';

interface CourseFormProps {
  open: boolean;
  onClose: () => void;
  editCourse?: any; // Allow editCourse prop

}

export function CourseForm({ open, onClose }: CourseFormProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courseId, setCourseId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [trainerName, setTrainerName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // ✅ Validate Input
    if (!courseId.trim()) {
      toast.error('Course ID is required');
      setIsSubmitting(false);
      return;
    }

    if (!title.trim()) {
      toast.error('Course title is required');
      setIsSubmitting(false);
      return;
    }

    if (!description.trim()) {
      toast.error('Course description is required');
      setIsSubmitting(false);
      return;
    }

    if (!trainerName.trim()) {
      toast.error('Trainer name is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = { courseId, title, description, trainerName };

      const response = await fetch('http://localhost:5000/api/trainer/createcourse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create course');
      }

      toast.success('Course created successfully');
      onClose();
      navigate('/courses');
    } catch (error) {
      toast.error(error.message || 'Error creating course');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg md:max-w-xl overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Create New Course</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Course ID
              <Input
                value={courseId}
                onChange={(e) => setCourseId(e.target.value)}
                placeholder="Enter course ID"
                className="mt-1"
              />
            </label>

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

            <label className="text-sm font-medium">
              Trainer Name
              <Input
                value={trainerName}
                onChange={(e) => setTrainerName(e.target.value)}
                placeholder="Enter trainer name"
                className="mt-1"
              />
            </label>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Create Course'}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
