import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Plus, 
  ImageIcon, 
  Camera,
  Info,
  CheckCircle,
  Coins
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { fetchWithAuth } from '@/lib/utils';

const AddItem = () => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [agreedToGuidelines, setAgreedToGuidelines] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [condition, setCondition] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const categories = [
    'Tops', 'Bottoms', 'Dresses', 'Jackets', 'Knitwear', 
    'Shoes', 'Accessories', 'Bags', 'Activewear', 'Formal'
  ];

  const sizes = {
    clothing: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    shoes: ['5', '6', '7', '8', '9', '10', '11', '12'],
    accessories: ['One Size', 'S', 'M', 'L']
  };

  const conditions = [
    { value: 'excellent', label: 'Excellent', description: 'Like new, no visible wear' },
    { value: 'good', label: 'Good', description: 'Minor signs of wear, fully functional' },
    { value: 'fair', label: 'Fair', description: 'Noticeable wear but still great' }
  ];

  // Points calculation logic
  const getPointsForCondition = (condition: string) => {
    switch (condition) {
      case 'excellent': return 50;
      case 'good': return 30;
      case 'fair': return 10;
      case 'new': return 60;
      case 'like_new': return 45;
      case 'used': return 5;
      case 'vintage': return 40;
      default: return 0;
    }
  };

  const estimatedPoints = getPointsForCondition(condition);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files).slice(0, 5 - imageFiles.length);
      setImageFiles(prev => [...prev, ...newFiles].slice(0, 5));
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newImages].slice(0, 5));
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags(prev => [...prev, currentTag.trim()]);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addTag();
    }
  };

  const isFormValid = () => {
    return (
      title.trim() &&
      description.trim() &&
      category &&
      size &&
      condition &&
      imageFiles.length > 0 &&
      agreedToGuidelines
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    if (!title.trim() || !description.trim() || !category || !size || !condition) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }
    if (imageFiles.length === 0) {
      setError('Please upload at least one image.');
      setLoading(false);
      return;
    }
    if (!agreedToGuidelines) {
      setError('You must agree to the guidelines.');
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category', category);
    formData.append('brand', brand);
    formData.append('size', size);
    formData.append('color', color);
    formData.append('condition', condition);
    formData.append('tags', tags.join(','));
    imageFiles.forEach(file => formData.append('images', file));
    try {
      const res = await fetchWithAuth('/api/items/', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        setSuccess('Item listed successfully!');
        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to list item');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">List New Item</h1>
        <p className="text-muted-foreground">
          Share your preloved clothes with the ReWear community and earn points
        </p>
      </div>
      <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
              <CardDescription>
                Add up to 5 photos. The first photo will be your main image.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">Upload Photos</p>
                    <p className="text-sm text-muted-foreground">
                      Drag and drop or click to select files
                    </p>
                    <Button variant="outline" className="mt-4">
                      <Camera className="mr-2 h-4 w-4" />
                      Choose Files
                    </Button>
                  </label>
                </div>

                {/* Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Upload ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-80 group-hover:opacity-100"
                          type="button"
                          onClick={() => removeImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Basic Details */}
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Vintage Denim Jacket"
                  className="text-base"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item's condition, style, fit, and any unique features..."
                  rows={4}
                  className="text-base"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(categoryOption => (
                        <SelectItem key={categoryOption} value={categoryOption.toLowerCase()}>
                          {categoryOption}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    placeholder="e.g., Levi's, Zara, H&M"
                    value={brand}
                    onChange={e => setBrand(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Size *</Label>
                  <Select value={size} onValueChange={setSize} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {sizes.clothing.map(size => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="color">Color</Label>
                  <Input
                    id="color"
                    placeholder="e.g., Blue, Black"
                    value={color}
                    onChange={e => setColor(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select value={condition} onValueChange={setCondition} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(condition => (
                        <SelectItem key={condition.value} value={condition.value}>
                          <div>
                            <div className="font-medium">{condition.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {condition.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Add tags to help others find your item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={addTag}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <button
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Suggested tags:</p>
                  <div className="flex flex-wrap gap-1">
                    {['vintage', 'casual', 'formal', 'summer', 'winter', 'trendy'].map(suggestion => (
                      <Button
                        key={suggestion}
                        variant="ghost"
                        size="sm"
                        className="h-auto py-1 px-2 text-xs"
                        onClick={() => {
                          if (!tags.includes(suggestion)) {
                            setTags(prev => [...prev, suggestion]);
                          }
                        }}
                      >
                        #{suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Points Preview */}
          <Card className="bg-gradient-secondary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-primary" />
                Estimated Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {estimatedPoints} pts
                </div>
                <p className="text-sm text-muted-foreground">
                  Based on category, condition, and brand
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Listing Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Items must be clean and in wearable condition</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Provide accurate descriptions and measurements</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Use clear, well-lit photos</span>
              </div>
              <div className="flex gap-2">
                <CheckCircle className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Be responsive to swap requests</span>
              </div>
            </CardContent>
          </Card>

          {/* Agreement & Submit */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="guidelines"
                    checked={agreedToGuidelines}
                    onCheckedChange={(checked) => setAgreedToGuidelines(checked as boolean)}
                  />
                  <Label htmlFor="guidelines" className="text-sm leading-relaxed">
                    I agree to the{' '}
                    <Button variant="link" className="px-0 text-sm h-auto">
                      community guidelines
                    </Button>
                    {' '}and confirm that this item meets ReWear's quality standards
                  </Label>
                </div>
                {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                {success && <div className="text-green-600 text-center text-sm">{success}</div>}
                <Button 
                  className="w-full" 
                  variant="hero"
                  disabled={!isFormValid() || loading}
                  type="submit"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  {loading ? 'Listing...' : 'List My Item'}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  Your item will be reviewed before appearing in the marketplace
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </form>
    </div>
  );
};

export default AddItem;