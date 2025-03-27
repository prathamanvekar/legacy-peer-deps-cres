
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, 
  FileText, 
  Home, 
  LogOut, 
  Menu, 
  User, 
  X 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  
  // Define nav items based on user role
  const navItems = [
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: <Home className="h-4 w-4" /> 
    },
    { 
      label: 'Courses', 
      path: '/courses', 
      icon: <BookOpen className="h-4 w-4" /> 
    },
    { 
      label: 'Assignments', 
      path: '/assignments', 
      icon: <FileText className="h-4 w-4" /> 
    },
    { 
      label: 'Profile', 
      path: '/profile', 
      icon: <User className="h-4 w-4" /> 
    },
  ];
  
  return (
    <nav className="sticky top-0 z-40 glass-effect px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/dashboard" className="text-xl font-medium">
            CloudLectures
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          
          {user && (
            <button 
              onClick={logout}
              className="nav-item text-gray-600 hover:text-red-500"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}
        </div>
        
        {/* User Avatar for both mobile and desktop */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span className="hidden md:inline text-sm font-medium">
                {user.name}
              </span>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-200">
                <img 
                  src={user.avatar || 'https://i.pravatar.cc/150'} 
                  alt={user.name}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          )}
          
          {/* Mobile menu button */}
          <button 
            onClick={toggleMenu} 
            className="md:hidden subtle-ring p-1 rounded-md"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-effect border-t border-white/10 px-4 py-3 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {user && (
              <button 
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="nav-item text-gray-600 hover:text-red-500"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
