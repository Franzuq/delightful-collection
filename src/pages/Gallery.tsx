import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtworkCard from '@/components/ArtworkCard';
import { Artwork } from '@/types/artwork';
import { Filter, SortDesc, SortAsc, Search, Sliders, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import artworkService from '@/services/artworkService';

const Gallery = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  // Categories for filtering
  const categories = [
    "Paintings", "Digital Art", "Photography", "Sculpture", "Abstract", "Landscape", "Portrait"
  ];

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const data = await artworkService.getAllArtworks();
        // Transform backend data to match our Artwork type
        const transformedArtworks = data.artworks.map((artwork: any) => ({
          id: artwork.id,
          title: artwork.title,
          artistName: artwork.artist_name,
          imageUrl: artwork.image_url,
          isFavorited: false // We'll need to check this from the user's favorites
        }));
        
        setArtworks(transformedArtworks);
        setFilteredArtworks(transformedArtworks);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching artworks:', error);
        toast({
          title: "Error loading artworks",
          description: "Please try again later",
          variant: "destructive",
        });
        setIsLoading(false);
      }
    };
    
    fetchArtworks();
  }, []);

  useEffect(() => {
    // Filter and sort artworks based on current filters
    let results = [...artworks];
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(
        artwork => 
          artwork.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          artwork.artistName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sort
    results.sort((a, b) => {
      if (sortOrder === "newest") {
        // In a real app, you would sort by created_at date
        return Number(b.id) - Number(a.id);
      } else {
        return Number(a.id) - Number(b.id);
      }
    });
    
    // Apply category filters (in a real app, artworks would have category properties)
    if (selectedCategories.length > 0) {
      // This is just a simulation - in a real app you'd filter by actual categories
      // Here we're just filtering randomly based on the ID to simulate the effect
      results = results.filter(artwork => 
        selectedCategories.some(cat => Number(artwork.id) % categories.length === categories.indexOf(cat))
      );
    }
    
    setFilteredArtworks(results);
  }, [artworks, searchQuery, sortOrder, selectedCategories]);

  const handleFavoriteToggle = (artworkId: string, isFavorited: boolean) => {
    // In a real app, this would make an API call
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id.toString() === artworkId 
          ? { ...artwork, isFavorited } 
          : artwork
      )
    );
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Convert our simplified Artwork to the format ArtworkCard expects
  const adaptArtworkForCard = (artwork: Artwork) => {
    return {
      id: artwork.id.toString(),
      title: artwork.title,
      imageUrl: artwork.imageUrl,
      description: "A beautiful piece of art", // Default description
      artist: {
        id: "artist-" + Math.floor(Math.random() * 1000),
        username: artwork.artistName,
      },
      likes: 0,
      comments: 0,
      isLiked: false,
      isFavorited: artwork.isFavorited || false,
      createdAt: new Date().toISOString(),
      tags: []
    };
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSortOrder("newest");
    
    toast({
      title: "Filters reset",
      description: "All filters have been reset to default values",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Gallery Header */}
        <section className="bg-gradient-to-r from-gallery-dark to-gallery-teal text-white py-12">
          <div className="gallery-container text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Art Gallery</h1>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Explore our curated collection of exceptional artworks from talented artists around the world.
            </p>
          </div>
        </section>
        
        {/* Gallery Filter Bar */}
        <div className="sticky top-16 z-40 bg-white border-b border-gray-200 shadow-sm">
          <div className="gallery-container py-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search by title or artist..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                
                <Select 
                  value={sortOrder}
                  onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">
                      <span className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        <span>Newest First</span>
                      </span>
                    </SelectItem>
                    <SelectItem value="oldest">
                      <span className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        <span>Oldest First</span>
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedCategories.length > 0 || searchQuery ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={handleResetFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        
        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="bg-gray-50 border-b border-gray-200 animate-fade-in">
            <div className="gallery-container py-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium flex items-center gap-2">
                  <Sliders className="h-4 w-4" />
                  Advanced Filters
                </h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Categories Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {categories.map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`category-${category}`} 
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                        />
                        <Label 
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Additional filter options would go here */}
              </div>
            </div>
          </div>
        )}
        
        {/* Gallery Content */}
        <section className="py-8">
          <div className="gallery-container">
            {isLoading ? (
              <div className="gallery-grid">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <div key={i} className="rounded-lg overflow-hidden shadow animate-pulse">
                    <div className="bg-gray-200 aspect-[4/5]"></div>
                    <div className="p-4 space-y-3 bg-white">
                      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredArtworks.length === 0 ? (
                  <div className="text-center py-16">
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No results found</h3>
                    <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                    <Button 
                      variant="outline" 
                      onClick={handleResetFilters}
                      className="mt-2"
                    >
                      Reset All Filters
                    </Button>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-4">
                      Showing {filteredArtworks.length} {filteredArtworks.length === 1 ? 'artwork' : 'artworks'}
                    </p>
                    <div className="gallery-grid">
                      {filteredArtworks.map(artwork => (
                        <ArtworkCard
                          key={artwork.id}
                          artwork={adaptArtworkForCard(artwork)}
                          onFavoriteToggle={handleFavoriteToggle}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Gallery;
