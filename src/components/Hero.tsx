
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="py-16 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute -top-24 -right-24 w-80 h-80 bg-gallery-light rounded-full opacity-20 blur-3xl"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gallery-green/20 rounded-full blur-3xl"></div>
      
      <div className="gallery-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-gallery-teal/10 text-gallery-teal text-sm font-medium">
              <span className="animate-pulse mr-2 h-2 w-2 rounded-full bg-gallery-teal"></span>
              Discover New Artists Every Week
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gallery-dark animate-fade-in">
              Experience Art in a
              <span className="text-gallery-teal"> Whole New Way</span>
            </h1>
            
            <p className="text-lg text-gray-600">
              Browse our curated collection of exceptional artworks from emerging and established artists worldwide. Find the perfect piece that speaks to your soul.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button className="bg-gallery-teal hover:bg-gallery-teal/90 text-white px-6" size="lg" asChild>
                <Link to="/gallery">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/artists">
                  Meet Our Artists
                </Link>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-4 text-sm text-gray-600">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-gray-200">
                    <img 
                      src={`https://i.pravatar.cc/100?img=${i+10}`} 
                      alt="User avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span>Join <b className="text-gallery-dark">5,000+</b> art enthusiasts</span>
            </div>
          </div>
          
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-lg overflow-hidden shadow-lg transform translate-y-8 image-shine-effect">
                  <img 
                    src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Art piece" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg image-shine-effect">
                  <img 
                    src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Art piece" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-10">
                <div className="rounded-lg overflow-hidden shadow-lg image-shine-effect">
                  <img 
                    src="https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Art piece" 
                    className="w-full h-auto"
                  />
                </div>
                <div className="rounded-lg overflow-hidden shadow-lg image-shine-effect">
                  <img 
                    src="https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80" 
                    alt="Art piece" 
                    className="w-full h-auto"
                  />
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -z-10 top-1/2 -right-12 w-24 h-24 bg-gallery-green/30 rounded-full blur-xl"></div>
            <div className="absolute -z-10 bottom-1/3 -left-8 w-20 h-20 bg-gallery-light rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
