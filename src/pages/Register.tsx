import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SignupForm from '@/components/auth/SignupForm';
import { useAuth } from '@/contexts/AuthContext';

const Signup = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/gallery');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="gallery-container">
          <div className="max-w-md mx-auto text-center mb-8">
            <h1 className="text-3xl font-bold text-gallery-dark mb-2">Create an Account</h1>
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gallery-teal hover:underline">
                Log in
              </Link>
            </p>
          </div>
          
          <SignupForm />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Signup;
