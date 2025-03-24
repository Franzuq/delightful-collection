import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-8">
      <div className="gallery-container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <Link to="/" className="text-xl font-bold text-gallery-dark">
              ArtGallery
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              A student project for showcasing beautiful artwork
            </p>
          </div>
          
          <div className="flex space-x-8">
            <div>
              <h4 className="font-medium text-gallery-dark mb-3">Navigation</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-gray-600 hover:text-gallery-teal">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/gallery" className="text-gray-600 hover:text-gallery-teal">
                    Gallery
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="text-gray-600 hover:text-gallery-teal">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ArtGallery Project. Created for educational purposes.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
