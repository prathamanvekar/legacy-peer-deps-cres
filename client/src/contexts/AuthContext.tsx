
import { createContext, useState, useContext, ReactNode } from 'react';

type UserRole = 'admin' | 'trainer' | 'student';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  contactNumber?: string;
  parentName?: string;
  parentContactNumber?: string;
  resume?: string;
  specialization?: string; // For trainers
  bio?: string; // For trainers
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for development
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    name: 'Admin User',
    role: 'admin',
    email: 'admin@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    username: 'trainer',
    name: 'Trainer User',
    role: 'trainer',
    email: 'trainer@example.com',
    avatar: 'https://i.pravatar.cc/150?img=2',
    specialization: 'Web Development',
    bio: 'Experienced web development instructor with 5+ years of teaching experience.'
  },
  {
    id: '3',
    username: 'student',
    name: 'Student User',
    role: 'student',
    email: 'student@example.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    contactNumber: '+1234567890',
    parentName: 'Parent Name',
    parentContactNumber: '+9876543210',
  }
];

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // In a real app, this would be an API call
    const foundUser = mockUsers.find(u => u.username === username);
    
    // For demo, any password works
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
