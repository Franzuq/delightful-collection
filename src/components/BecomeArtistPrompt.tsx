import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import authService from '@/services/authService';
import { Palette } from 'lucide-react';

interface BecomeArtistPromptProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const BecomeArtistPrompt = ({ onSuccess, onCancel }: BecomeArtistPromptProps) => {
  const { user, token, login } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleBecomeArtist = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to become an artist",
        variant: "destructive",
      });
      return;
    }

    setIsUpdating(true);
    try {
      const response = await authService.updateArtistStatus(true, token);
      
      // Update local auth context with new token and user info
      if (user && response.token) {
        const updatedUser = { 
          ...user, 
          is_artist: true 
        };
        login(response.token, updatedUser);
      }
      
      toast({
        title: "Artist status updated",
        description: "You can now upload your artworks!",
        variant: "default",
      });
      
      onSuccess();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-center mb-4">
        <div className="bg-gallery-teal/10 p-3 rounded-full">
          <Palette className="h-8 w-8 text-gallery-teal" />
        </div>
      </div>
      
      <h3 className="text-xl font-semibold text-center mb-2">Become an Artist</h3>
      
      <p className="text-gray-600 mb-6 text-center">
        To upload artworks, you need to become an artist on our platform. 
        This will give you access to all artist features.
      </p>
      
      <div className="space-y-3">
        <Button 
          className="w-full bg-gallery-teal hover:bg-gallery-teal/90"
          disabled={isUpdating}
          onClick={handleBecomeArtist}
        >
          {isUpdating ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              Updating...
            </span>
          ) : (
            "Become an Artist"
          )}
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onCancel}
          disabled={isUpdating}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default BecomeArtistPrompt; 