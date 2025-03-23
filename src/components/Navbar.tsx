
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, X, User, LogIn } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Check if user is on a specific page
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="sticky top-0 z-50 navbar-glass border-b border-gray-200 transition-all duration-300">
      <div className="gallery-container">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gallery-dark">
              Artistry
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium ${isActive('/') ? 'text-gallery-teal' : 'text-gallery-dark hover:text-gallery-teal transition-colors'}`}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`text-sm font-medium ${isActive('/gallery') ? 'text-gallery-teal' : 'text-gallery-dark hover:text-gallery-teal transition-colors'}`}
            >
              Gallery
            </Link>
            <Link 
              to="/artists" 
              className={`text-sm font-medium ${isActive('/artists') ? 'text-gallery-teal' : 'text-gallery-dark hover:text-gallery-teal transition-colors'}`}
            >
              Artists
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium ${isActive('/about') ? 'text-gallery-teal' : 'text-gallery-dark hover:text-gallery-teal transition-colors'}`}
            >
              About
            </Link>
          </div>
          
          {/* Search, Auth & Mobile Menu */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" className="flex items-center gap-1">
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Link>
              </Button>
              <Button className="bg-gallery-teal hover:bg-gallery-teal/90" size="sm" asChild>
                <Link to="/register">Sign Up</Link>
              </Button>
            </div>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 px-2 space-y-3 border-t border-gray-200 animate-slide-in">
            <Link 
              to="/" 
              className={`block py-2 px-3 rounded-md ${isActive('/') ? 'bg-gallery-teal/10 text-gallery-teal' : 'text-gallery-dark'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className={`block py-2 px-3 rounded-md ${isActive('/gallery') ? 'bg-gallery-teal/10 text-gallery-teal' : 'text-gallery-dark'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              to="/artists" 
              className={`block py-2 px-3 rounded-md ${isActive('/artists') ? 'bg-gallery-teal/10 text-gallery-teal' : 'text-gallery-dark'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link 
              to="/about" 
              className={`block py-2 px-3 rounded-md ${isActive('/about') ? 'bg-gallery-teal/10 text-gallery-teal' : 'text-gallery-dark'}`}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <div className="pt-2 flex flex-col gap-2 border-t border-gray-100">
              <Link 
                to="/login" 
                className="flex items-center justify-center w-full py-2 text-gallery-dark border border-gray-200 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
              <Link 
                to="/register" 
                className="flex items-center justify-center w-full py-2 bg-gallery-teal text-white rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                <User className="h-4 w-4 mr-2" />
                Sign Up
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
