
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArtworkCard, { Artwork } from '@/components/ArtworkCard';
import { Filter, SortDesc, SortAsc, Search, Sliders, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

// Mock data for gallery
const GALLERY_ARTWORKS: Artwork[] = [
  {
    id: 1,
    title: "Ethereal Dreams",
    artistName: "Sophia Chen",
    price: 2500,
    imageUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 2,
    title: "Urban Symphony",
    artistName: "Marcus Lee",
    price: 1800,
    imageUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 3,
    title: "Celestial Harmony",
    artistName: "Elena Rivera",
    price: 3200,
    imageUrl: "https://images.unsplash.com/photo-1549490349-8643362247b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 4,
    title: "Whispers of Nature",
    artistName: "Julian Wright",
    price: 1950,
    imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 5,
    title: "Abstract Thoughts",
    artistName: "Olivia Taylor",
    price: 2200,
    imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 6,
    title: "City Lights",
    artistName: "Thomas Berg",
    price: 1700,
    imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 7,
    title: "Ocean Serenity",
    artistName: "Mia Johnson",
    price: 2800,
    imageUrl: "https://images.unsplash.com/photo-1580196969807-cc6de282abfb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 8,
    title: "Mountain Majesty",
    artistName: "David Wilson",
    price: 3500,
    imageUrl: "https://images.unsplash.com/photo-1552083375-1447ce886485?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 9,
    title: "Desert Dreams",
    artistName: "Sophia Chen",
    price: 1900,
    imageUrl: "https://images.unsplash.com/photo-1544867885-2333f61544ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 10,
    title: "Twilight Fantasy",
    artistName: "Elena Rivera",
    price: 2700,
    imageUrl: "https://images.unsplash.com/photo-1585908286456-991f6e0823a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 11,
    title: "Industrial Revolution",
    artistName: "Marcus Lee",
    price: 3100,
    imageUrl: "https://images.unsplash.com/photo-1584389368340-f95c31c33717?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  },
  {
    id: 12,
    title: "Blossoming Hope",
    artistName: "Julian Wright",
    price: 2300,
    imageUrl: "https://images.unsplash.com/photo-1579541814924-49fef17c5be5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
  }
];

const Gallery = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { toast } = useToast();

  // Categories for filtering
  const categories = [
    "Paintings", "Digital Art", "Photography", "Sculpture", "Abstract", "Landscape", "Portrait"
  ];

  useEffect(() => {
    // Simulate API fetch with a small delay
    const timer = setTimeout(() => {
      setArtworks(GALLERY_ARTWORKS);
      setFilteredArtworks(GALLERY_ARTWORKS);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
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
    
    // Apply price filter
    results = results.filter(
      artwork => artwork.price >= priceRange[0] && artwork.price <= priceRange[1]
    );
    
    // Apply category filters (in a real app, artworks would have category properties)
    if (selectedCategories.length > 0) {
      // This is just a simulation - in a real app you'd filter by actual categories
      // Here we're just filtering randomly based on the ID to simulate the effect
      results = results.filter(artwork => 
        selectedCategories.some(cat => artwork.id % categories.length === categories.indexOf(cat))
      );
    }
    
    // Apply sort
    results.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    
    setFilteredArtworks(results);
  }, [artworks, searchQuery, priceRange, sortOrder, selectedCategories]);

  const handleFavoriteToggle = (id: number) => {
    // In a real app, this would make an API call
    setArtworks(prevArtworks => 
      prevArtworks.map(artwork => 
        artwork.id === id 
          ? { ...artwork, isFavorited: !artwork.isFavorited } 
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

  const handleResetFilters = () => {
    setSearchQuery("");
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSortOrder("asc");
    
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
                  onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">
                      <div className="flex items-center gap-2">
                        <SortAsc className="h-4 w-4" />
                        <span>Price: Low to High</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="desc">
                      <div className="flex items-center gap-2">
                        <SortDesc className="h-4 w-4" />
                        <span>Price: High to Low</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                
                {selectedCategories.length > 0 || searchQuery || priceRange[0] > 0 || priceRange[1] < 5000 ? (
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
                {/* Price Range Filter */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Price Range</h4>
                  <Slider
                    value={priceRange}
                    min={0}
                    max={5000}
                    step={100}
                    onValueChange={setPriceRange}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
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
                          artwork={artwork}
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
