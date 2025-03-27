
// Mock data for development

export interface Course {
  id: string;
  title: string;
  description: string;
  materials: Material[];
  createdAt: string;
  trainerId: string;
}

export interface Material {
  id: string;
  title: string;
  type: 'ppt' | 'pdf' | 'doc';
  url: string;
  isReleased: boolean;
  uploadDate: string;
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  submissions: Submission[];
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  photo?: string;
  parentName: string;
  contactNumber: string;
  parentContactNumber: string;
  resume?: string;
}

export interface Trainer {
  id: string;
  name: string;
  email: string;
  specialization: string;
  courses: string[]; // course IDs
}

// Mock Courses
export const mockCourses: Course[] = [
  {
    id: '1',
    title: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript',
    materials: [
      {
        id: '101',
        title: 'HTML Fundamentals',
        type: 'ppt',
        url: '#',
        isReleased: true,
        uploadDate: '2023-01-15',
      },
      {
        id: '102',
        title: 'CSS Styling',
        type: 'ppt',
        url: '#',
        isReleased: true,
        uploadDate: '2023-01-22',
      },
      {
        id: '103',
        title: 'JavaScript Basics',
        type: 'ppt',
        url: '#',
        isReleased: false,
        uploadDate: '2023-01-29',
      },
    ],
    createdAt: '2023-01-10',
    trainerId: '2',
  },
  {
    id: '2',
    title: 'Advanced React Development',
    description: 'Master React.js and related libraries',
    materials: [
      {
        id: '201',
        title: 'React Components',
        type: 'ppt',
        url: '#',
        isReleased: true,
        uploadDate: '2023-02-05',
      },
      {
        id: '202',
        title: 'State Management',
        type: 'ppt',
        url: '#',
        isReleased: false,
        uploadDate: '2023-02-12',
      },
    ],
    createdAt: '2023-02-01',
    trainerId: '2',
  },
];

// Mock Assignments
export const mockAssignments: Assignment[] = [
  {
    id: '1',
    courseId: '1',
    title: 'Create a Simple Webpage',
    description: 'Build a webpage using HTML and CSS based on the provided design',
    dueDate: '2023-01-25',
    submissions: [
      {
        id: '1001',
        assignmentId: '1',
        studentId: '3',
        fileUrl: '#',
        submittedAt: '2023-01-24',
        grade: 85,
        feedback: 'Good work, but needs improvement in responsive design.',
      },
    ],
  },
  {
    id: '2',
    courseId: '2',
    title: 'Build a React Component',
    description: 'Create a reusable React component with props and state',
    dueDate: '2023-02-20',
    submissions: [],
  },
];

// Mock Students
export const mockStudents: Student[] = [
  {
    id: '3',
    name: 'Student User',
    email: 'student@example.com',
    photo: 'https://i.pravatar.cc/150?img=3',
    parentName: 'Parent Name',
    contactNumber: '+1234567890',
    parentContactNumber: '+9876543210',
    resume: '#',
  },
];

// Mock Trainers
export const mockTrainers: Trainer[] = [
  {
    id: '2',
    name: 'Trainer User',
    email: 'trainer@example.com',
    specialization: 'Web Development',
    courses: ['1', '2'],
  },
];
