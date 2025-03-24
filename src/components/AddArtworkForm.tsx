import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/useToast';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import artworkService from '@/services/artworkService';
import BecomeArtistPrompt from './BecomeArtistPrompt';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const AddArtworkForm = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showArtistPrompt, setShowArtistPrompt] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
    image?: string;
  }>({});

  // Check if the user is an artist
  const isArtist = user?.is_artist || false;

  const validateForm = () => {
    const newErrors: {
      title?: string;
      description?: string;
      image?: string;
    } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Title is required';
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
      isValid = false;
    }

    if (!image) {
      newErrors.image = 'Please upload an image';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, image: 'File size exceeds 5MB limit' }));
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, image: 'Please upload an image file' }));
      return;
    }

    setImage(file);
    setErrors(prev => ({ ...prev, image: undefined }));

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if user is an artist first
    if (!isArtist) {
      setShowArtistPrompt(true);
      return;
    }
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      
      if (tags.trim()) {
        // Split tags and trim whitespace
        const tagArray = tags.split(',').map(tag => tag.trim());
        for (const tag of tagArray) {
          formData.append('tags', tag);
        }
      }
      
      if (image) {
        formData.append('image', image);
      }
      
      const response = await artworkService.addArtwork(formData, token!);
      
      toast({
        title: "Artwork uploaded successfully!",
        description: "Your artwork is now visible in the gallery.",
        variant: "default",
      });
      
      // Redirect to the artwork page
      navigate(`/artwork/${response.id}`);
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your artwork. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // If showing artist prompt, show that instead of the form
  if (showArtistPrompt) {
    return (
      <BecomeArtistPrompt 
        onSuccess={() => setShowArtistPrompt(false)} 
        onCancel={() => navigate('/gallery')} 
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title*
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter artwork title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description*
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe your artwork..."
          rows={4}
          className={errors.description ? 'border-red-500' : ''}
        />
        {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
          Tags (comma separated)
        </label>
        <Input
          id="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g. abstract, painting, digital"
        />
        <p className="mt-1 text-xs text-gray-500">
          Add relevant tags to help users discover your artwork
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Artwork Image*
        </label>
        
        {!imagePreview ? (
          <div 
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition-colors ${
              errors.image ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-sm text-gray-600">Click to upload or drag and drop</p>
            <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
          </div>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Artwork preview"
              className="w-full h-64 object-contain border rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8 rounded-full shadow-md"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {errors.image && <p className="mt-1 text-xs text-red-500">{errors.image}</p>}
      </div>

      <Button 
        type="submit" 
        className="w-full bg-gallery-teal hover:bg-gallery-teal/90"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Artwork
          </span>
        )}
      </Button>
    </form>
  );
};

export default AddArtworkForm; 