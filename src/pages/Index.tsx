import React from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import FeaturedArtworks from '@/components/FeaturedArtworks';
import Footer from '@/components/Footer';
import { ArrowRight, Users, Image, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero />
        
        <FeaturedArtworks />
        
        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="gallery-container">
            <h2 className="section-title text-center">Explore Art Categories</h2>
            <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
              Discover artwork by medium, style, subject matter, and more to find the perfect piece for your collection.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Paintings",
                  desc: "From oil and acrylic to watercolor and mixed media",
                  image: "https://images.unsplash.com/photo-1578301978162-7df5682c7821?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Sculptures",
                  desc: "Three-dimensional artworks in various materials",
                  image: "https://images.unsplash.com/photo-1610219171189-a3f2a653f2f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Digital Art",
                  desc: "Computer-generated artworks and NFTs",
                  image: "https://images.unsplash.com/photo-1563089145-599997674d42?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Photography",
                  desc: "Fine art photography from diverse perspectives",
                  image: "https://images.unsplash.com/photo-1500051638674-ff996a0ec29e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Printmaking",
                  desc: "Lithographs, screen prints, etchings, and more",
                  image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Mixed Media",
                  desc: "Artworks combining multiple materials and techniques",
                  image: "https://images.unsplash.com/photo-1501084291732-13b1ba8f0ebc?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                }
              ].map((category, index) => (
                <div key={index} className="group relative rounded-lg overflow-hidden shadow-md bg-white hover:shadow-xl transition-all duration-300">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={category.image} 
                      alt={category.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gallery-dark mb-2">{category.title}</h3>
                    <p className="text-gray-600 mb-4">{category.desc}</p>
                    <Button 
                      variant="outline" 
                      className="group-hover:bg-gallery-teal group-hover:text-white group-hover:border-gallery-teal transition-colors duration-300"
                    >
                      Explore
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* For Artists Section */}
        <section className="py-16 bg-gallery-dark text-white">
          <div className="gallery-container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-4 inline-flex items-center px-3 py-1 rounded-full bg-gallery-teal/20 text-gallery-teal text-sm font-medium">
                  For Artists
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Showcase Your Talent to the World</h2>
                <p className="text-gray-300 mb-6">
                  Join our community of talented artists and reach art enthusiasts across the globe. We provide the platform, you provide the creativity.
                </p>
                
                <div className="space-y-4 mb-8">
                  {[
                    {
                      icon: <Image className="h-5 w-5 text-gallery-teal" />,
                      title: "Showcase Your Portfolio",
                      desc: "Create a stunning profile to display your best works"
                    },
                    {
                      icon: <Users className="h-5 w-5 text-gallery-teal" />,
                      title: "Connect with Collectors",
                      desc: "Build relationships with art lovers and collectors"
                    },
                    {
                      icon: <ShieldCheck className="h-5 w-5 text-gallery-teal" />,
                      title: "Secure Transactions",
                      desc: "Sell your artwork with secure payment processing"
                    }
                  ].map((feature, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="mt-1 flex-shrink-0 w-10 h-10 rounded-full bg-gallery-teal/10 flex items-center justify-center">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white">{feature.title}</h3>
                        <p className="text-sm text-gray-400">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button className="bg-gallery-teal hover:bg-gallery-teal/90 text-white" size="lg" asChild>
                  <Link to="/register?type=artist">
                    Join as an Artist
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
              
              <div className="relative">
                <div className="aspect-square rounded-lg overflow-hidden border-8 border-white/10 shadow-xl transform rotate-2">
                  <img 
                    src="https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="Artist working" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Stats */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-4 max-w-[200px]">
                  <div className="text-gallery-dark text-sm font-medium">Artist Success</div>
                  <div className="text-2xl font-bold text-gallery-dark">$2.4M+</div>
                  <div className="text-xs text-gray-500">Art sold through our platform</div>
                </div>
                
                <div className="absolute -top-6 -right-6 bg-white rounded-lg shadow-lg p-4 max-w-[200px]">
                  <div className="text-gallery-dark text-sm font-medium">Global Reach</div>
                  <div className="text-2xl font-bold text-gallery-dark">120+</div>
                  <div className="text-xs text-gray-500">Countries with active collectors</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        {/* Removed "What Our Community Says" section as requested */}
        
        {/* CTA Section */}
        {/* Removed "Ready to Discover Amazing Art?" section as requested */}
        
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
