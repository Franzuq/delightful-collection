import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Search, Menu, X, Upload, Bookmark } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  
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
          </div>
          
          {/* Search & Auth */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <Search className="h-4 w-4" />
            </Button>
            
            {/* Auth Links - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/upload" className="flex items-center gap-1">
                      <Upload className="h-4 w-4 mr-1" />
                      Share Artwork
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/favorites" className="flex items-center gap-1">
                      <Bookmark className="h-4 w-4 mr-1" />
                      Favorites
                    </Link>
                  </Button>
                  <span className="text-sm font-medium text-gallery-dark">
                    Hi, {user?.username}
                  </span>
                  <Link 
                    to="/profile" 
                    className="text-sm font-medium text-gallery-dark hover:text-gallery-teal transition-colors"
                  >
                    Profile
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="text-sm font-medium text-gallery-dark hover:text-gallery-teal"
                  >
                    Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link to="/login">Login</Link>
                  </Button>
                  <Button className="bg-gallery-teal hover:bg-gallery-teal/90" size="sm" asChild>
                    <Link to="/register">Sign Up</Link>
                  </Button>
                </>
              )}
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
          <div className="py-3 px-5 border-t border-gray-100 md:hidden">
            <Link 
              to="/" 
              className="block py-2 text-gallery-dark hover:text-gallery-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/gallery" 
              className="block py-2 text-gallery-dark hover:text-gallery-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              Gallery
            </Link>
            <Link 
              to="/artists" 
              className="block py-2 text-gallery-dark hover:text-gallery-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              Artists
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-gallery-dark hover:text-gallery-teal"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            {/* Auth Links - Mobile */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {isAuthenticated ? (
                <>
                  <Link 
                    to="/upload" 
                    className="flex items-center py-2 text-gallery-dark hover:text-gallery-teal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Share Artwork
                  </Link>
                  <Link 
                    to="/favorites" 
                    className="flex items-center py-2 text-gallery-dark hover:text-gallery-teal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Bookmark className="h-4 w-4 mr-2" />
                    Favorites
                  </Link>
                  <span className="block py-2 text-gallery-dark">
                    Hi, {user?.username}
                  </span>
                  <Link 
                    to="/profile" 
                    className="block py-2 text-gallery-dark hover:text-gallery-teal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gallery-dark hover:text-gallery-teal w-full text-left"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="block py-2 text-gallery-dark hover:text-gallery-teal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="block py-2 text-gallery-dark hover:text-gallery-teal"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
