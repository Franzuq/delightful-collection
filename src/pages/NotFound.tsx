
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12">
        <div className="gallery-container text-center max-w-2xl">
          <div className="relative mb-6 inline-block">
            <div className="text-8xl md:text-9xl font-bold text-gallery-dark">404</div>
            <div className="absolute -bottom-3 -right-3 w-full h-full flex items-end justify-end">
              <div className="text-8xl md:text-9xl font-bold text-gray-100 -z-10 transform translate-x-2 translate-y-2">
                404
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gallery-dark mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist or has been moved.
            Let's get you back to exploring amazing art!
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link to="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Link>
            </Button>
            
            <Button variant="outline" asChild>
              <Link to="/gallery" className="flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Explore Gallery
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
