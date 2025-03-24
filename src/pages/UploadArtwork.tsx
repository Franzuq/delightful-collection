import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AddArtworkForm from '@/components/AddArtworkForm';
import { useAuth } from '@/contexts/AuthContext';

const UploadArtwork = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/upload' } });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null; // Don't render anything if not authenticated (will redirect)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gallery-dark mb-2">Share Your Artwork</h1>
          <p className="text-gray-600 mb-8">
            Share your creative work with our community. Upload images of your artwork and join the conversation.
          </p>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <AddArtworkForm />
          </div>
          
          <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-medium text-gallery-dark mb-3">Submission Guidelines</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Upload only your own original artwork or content you have permission to share</li>
              <li>• High quality images are recommended (minimum 800px on shortest side)</li>
              <li>• Add descriptive titles and detailed descriptions to help others find your work</li>
              <li>• Use relevant tags to categorize your artwork properly</li>
              <li>• Respect the community by posting appropriate content</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UploadArtwork; 