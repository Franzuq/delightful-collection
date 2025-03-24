import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Paintbrush } from 'lucide-react';
import { useToast } from '@/hooks/useToast';
import authService from '@/services/authService';
import { Separator } from '@/components/ui/separator';

export const UserProfile = () => {
  const { user, token, login, logout } = useAuth();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUpdatingArtistStatus, setIsUpdatingArtistStatus] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      // Redirect is handled by the auth context and ProtectedRoute
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBecomeArtist = async () => {
    if (!token) {
      toast({
        title: "Authentication required",
        description: "Please log in to become an artist",
        variant: "destructive",
      });
      return;
    }

    setIsUpdatingArtistStatus(true);
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
        description: "You can now upload and sell your artworks!",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "There was an error updating your status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingArtistStatus(false);
    }
  };

  if (!user) {
    return null;
  }

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage src="" alt={user.username} />
          <AvatarFallback>{getInitials(user.username)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-2xl">{user.username}</CardTitle>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {user.is_artist && (
            <Badge variant="outline" className="mt-2 bg-gallery-teal/10 text-gallery-teal">
              Artist
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-medium">Account Information</h3>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
            <span className="text-muted-foreground">Member since:</span>
            <span>{new Date().toLocaleDateString()}</span>
          </div>
        </div>
        
        <Separator />
        
        {!user.is_artist ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-gallery-teal" />
              <h3 className="font-medium">Become an Artist</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              As an artist, you can upload and sell your artwork on our platform.
            </p>
            <Button 
              variant="default" 
              className="w-full bg-gallery-teal hover:bg-gallery-teal/90"
              onClick={handleBecomeArtist}
              disabled={isUpdatingArtistStatus}
            >
              {isUpdatingArtistStatus ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Updating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Paintbrush className="h-4 w-4" />
                  Become an Artist
                </span>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Paintbrush className="h-5 w-5 text-gallery-teal" />
              <h3 className="font-medium">Artist Status</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You are currently registered as an artist on our platform.
              You can upload and sell your artwork.
            </p>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.location.href = '/upload'}
            >
              Upload New Artwork
            </Button>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          className="w-full" 
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Logging out...' : 'Log Out'}
        </Button>
      </CardFooter>
    </Card>
  );
}; 