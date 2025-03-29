
import { useState, useEffect } from 'react';
import { Bell, Calendar, CheckCircle } from 'lucide-react';
import { format, isBefore, addDays, differenceInDays } from 'date-fns';
import { toast } from 'sonner';

interface DeadlineReminderProps {
  dueDate: string;
  title: string;
  id: string;
  isSubmitted: boolean;
}

export function DeadlineReminder({ dueDate, title, id, isSubmitted }: DeadlineReminderProps) {
  const [reminderSet, setReminderSet] = useState(false);
  const [daysLeft, setDaysLeft] = useState(0);
  
  useEffect(() => {
    const due = new Date(dueDate);
    const today = new Date();
    const diff = differenceInDays(due, today);
    setDaysLeft(diff);
    
    // Check local storage for existing reminders
    const reminders = JSON.parse(localStorage.getItem('assignment_reminders') || '{}');
    setReminderSet(!!reminders[id]);
  }, [dueDate, id]);
  
  const setReminder = () => {
    // Store reminder in local storage (in a real app, this would use a notification API)
    const reminders = JSON.parse(localStorage.getItem('assignment_reminders') || '{}');
    reminders[id] = {
      title,
      dueDate,
      reminderDate: format(addDays(new Date(), -1), 'yyyy-MM-dd') // Remind 1 day before
    };
    localStorage.setItem('assignment_reminders', JSON.stringify(reminders));
    setReminderSet(true);
    toast.success(`Reminder set for ${title}`);
  };
  
  // Don't show reminder UI if already submitted or past due
  if (isSubmitted || daysLeft < 0) return null;
  
  return (
    <div className="mt-2 flex items-center gap-2">
      {reminderSet ? (
        <div className="flex items-center text-xs text-green-600">
          <Bell className="h-3 w-3 mr-1" />
          <span>Reminder set</span>
        </div>
      ) : (
        <button 
          onClick={setReminder}
          className="flex items-center text-xs text-primary hover:underline"
        >
          <Bell className="h-3 w-3 mr-1" />
          <span>Set reminder</span>
        </button>
      )}
      
      {daysLeft <= 3 && (
        <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          {daysLeft === 0 ? 'Due today!' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
        </span>
      )}
    </div>
  );
}
