import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Heart, MessageSquare, Bookmark, Share2, ArrowLeft, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import artworkService from '@/services/artworkService';

// Import modular components
import ArtworkImage from '@/components/artwork/ArtworkImage';
import ArtworkInfo from '@/components/artwork/ArtworkInfo';
import ArtworkMetadata from '@/components/artwork/ArtworkMetadata';
import ActionButtons from '@/components/artwork/ActionButtons';
import ArtistPreview from '@/components/artwork/ArtistPreview';
import RelatedArtworks from '@/components/artwork/RelatedArtworks';

// Import mock data
import { SAMPLE_ARTWORK, ARTWORK_DETAILS, RELATED_ARTWORKS } from '@/data/mockData';

interface Comment {
  id: string;
  content: string;
  user: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  createdAt: string;
}

interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  artist: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  isFavorited: boolean;
  createdAt: string;
  tags?: string[];
}

const ArtworkDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, token, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  useEffect(() => {
    const fetchArtwork = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const data = await artworkService.getArtworkById(id);
        setArtwork(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching artwork:', err);
        setError('Failed to load artwork. It may have been removed or is unavailable.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchArtwork();
  }, [id]);
  
  useEffect(() => {
    const fetchComments = async () => {
      if (!id) return;
      
      setIsLoadingComments(true);
      try {
        const data = await artworkService.getComments(id);
        setComments(data);
      } catch (err) {
        console.error('Error fetching comments:', err);
        // We don't set the main error here to still show the artwork
      } finally {
        setIsLoadingComments(false);
      }
    };
    
    fetchComments();
  }, [id]);
  
  const handleLikeToggle = async () => {
    if (!isAuthenticated || !artwork) {
      toast({
        title: "Authentication required",
        description: "Please log in to like artworks",
        variant: "destructive",
      });
      return;
    }

    try {
      await artworkService.toggleLike(artwork.id, token!);
      setArtwork(prev => {
        if (!prev) return prev;
        const newIsLiked = !prev.isLiked;
        return {
          ...prev,
          isLiked: newIsLiked,
          likes: newIsLiked ? prev.likes + 1 : prev.likes - 1
        };
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your request",
        variant: "destructive",
      });
    }
  };

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated || !artwork) {
      toast({
        title: "Authentication required",
        description: "Please log in to favorite artworks",
        variant: "destructive",
      });
      return;
    }

    try {
      await artworkService.toggleFavorite(artwork.id, token!);
      setArtwork(prev => {
        if (!prev) return prev;
        const newIsFavorited = !prev.isFavorited;
        return {
          ...prev,
          isFavorited: newIsFavorited
        };
      });
      
      toast({
        title: artwork.isFavorited ? "Removed from favorites" : "Added to favorites",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not process your request",
        variant: "destructive",
      });
    }
  };
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated || !artwork) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment",
        variant: "destructive",
      });
      return;
    }
    
    if (!commentText.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmittingComment(true);
    
    try {
      const newComment = await artworkService.addComment(artwork.id, commentText, token!);
      
      // Add comment to the list
      setComments(prev => [newComment, ...prev]);
      
      // Update comment count
      setArtwork(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments: prev.comments + 1
        };
      });
      
      // Clear input
      setCommentText('');
      
      toast({
        title: "Comment added",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not post your comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingComment(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-2/3 aspect-[4/3] bg-gray-200 rounded-lg"></div>
              <div className="w-full md:w-1/3 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-32 bg-gray-200 rounded w-full"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !artwork) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow container mx-auto py-8 px-4">
          <div className="max-w-md mx-auto text-center py-20">
            <h1 className="text-2xl font-bold text-gallery-dark mb-4">Artwork Not Found</h1>
            <p className="text-gray-600 mb-8">{error || "This artwork doesn't exist or has been removed."}</p>
            <Button 
              onClick={() => navigate('/gallery')}
              className="bg-gallery-teal hover:bg-gallery-teal/90"
            >
              Return to Gallery
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto py-8 px-4">
        <Link 
          to="/gallery" 
          className="inline-flex items-center text-gallery-dark hover:text-gallery-teal mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Gallery
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Artwork Image */}
          <div className="col-span-1 lg:col-span-2">
            <div className="bg-white p-3 rounded-lg shadow-md">
              <img 
                src={artwork.imageUrl} 
                alt={artwork.title} 
                className="w-full rounded-md object-contain"
              />
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 px-2">
                <div className="flex items-center gap-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`flex items-center gap-1 ${artwork.isLiked ? 'text-red-500' : 'text-gray-500'}`} 
                    onClick={handleLikeToggle}
                  >
                    <Heart className={`h-5 w-5 ${artwork.isLiked ? 'fill-current' : ''}`} />
                    <span>{artwork.likes}</span>
                  </Button>
                  
                  <button className="flex items-center gap-1 text-gray-500">
                    <MessageSquare className="h-5 w-5" />
                    <span>{artwork.comments}</span>
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`p-2 ${artwork.isFavorited ? 'text-gallery-teal' : 'text-gray-500'}`} 
                    onClick={handleFavoriteToggle}
                  >
                    <Bookmark className={`h-5 w-5 ${artwork.isFavorited ? 'fill-current' : ''}`} />
                    <span className="ml-1 hidden sm:inline">
                      {artwork.isFavorited ? 'Saved' : 'Save'}
                    </span>
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2 text-gray-500" 
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      toast({
                        title: "Link copied to clipboard",
                        variant: "default",
                      });
                    }}
                  >
                    <Share2 className="h-5 w-5" />
                    <span className="ml-1 hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Artwork Details */}
          <div className="col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h1 className="text-2xl font-bold text-gallery-dark mb-2">{artwork.title}</h1>
              
              <Link
                to={`/artist/${artwork.artist.id}`}
                className="flex items-center gap-2 mb-4"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                  {artwork.artist.avatarUrl ? (
                    <img 
                      src={artwork.artist.avatarUrl} 
                      alt={artwork.artist.username} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gallery-teal text-white text-xs font-medium">
                      {artwork.artist.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <span className="text-sm font-medium">{artwork.artist.username}</span>
                  <p className="text-xs text-gray-500">
                    {formatDate(artwork.createdAt)}
                  </p>
                </div>
              </Link>
              
              <div className="border-t border-gray-100 pt-4 mb-4">
                <h2 className="text-lg font-medium text-gallery-dark mb-2">About this artwork</h2>
                <p className="text-gray-600 whitespace-pre-line">{artwork.description}</p>
              </div>
              
              {artwork.tags && artwork.tags.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gallery-dark mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {artwork.tags.map((tag, index) => (
                      <Link 
                        key={index} 
                        to={`/gallery?tag=${tag}`}
                        className="text-xs bg-gray-100 hover:bg-gallery-teal/10 text-gray-600 hover:text-gallery-teal px-2 py-1 rounded-full transition-colors"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Comments Section */}
        <div className="mt-10" id="comments">
          <h2 className="text-xl font-bold text-gallery-dark mb-6">Comments ({artwork.comments})</h2>
          
          {isAuthenticated ? (
            <form onSubmit={handleSubmitComment} className="mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  {user?.username ? (
                    <div className="w-full h-full flex items-center justify-center bg-gallery-teal text-white text-sm font-medium">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gallery-teal text-white text-sm font-medium">
                      ?
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <Textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Add a comment..."
                    className="min-h-[100px] mb-2"
                  />
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="bg-gallery-teal hover:bg-gallery-teal/90"
                      disabled={isSubmittingComment || !commentText.trim()}
                    >
                      {isSubmittingComment ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Posting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="h-4 w-4" />
                          Post
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center mb-8">
              <p className="text-gray-600 mb-4">Please sign in to join the conversation</p>
              <Button 
                onClick={() => navigate('/login', { state: { from: `/artwork/${id}` } })}
                className="bg-gallery-teal hover:bg-gallery-teal/90"
              >
                Sign In to Comment
              </Button>
            </div>
          )}
          
          {isLoadingComments ? (
            <div className="animate-pulse space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                  <div className="flex-grow">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6 mb-3"></div>
                    <div className="space-y-1">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gallery-dark mb-1">No comments yet</h3>
              <p className="text-gray-500">Be the first to share your thoughts on this artwork</p>
            </div>
          ) : (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                    {comment.user.avatarUrl ? (
                      <img 
                        src={comment.user.avatarUrl} 
                        alt={comment.user.username} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gallery-teal text-white text-sm font-medium">
                        {comment.user.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <Link 
                        to={`/artist/${comment.user.id}`}
                        className="font-medium text-gallery-dark hover:text-gallery-teal"
                      >
                        {comment.user.username}
                      </Link>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-line">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ArtworkDetail;
