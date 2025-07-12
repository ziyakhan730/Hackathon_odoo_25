import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart,
  Star,
  MapPin,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Browse = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [brand, setBrand] = useState('All Brands');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Helper to build query string
  const buildQuery = () => {
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (category && category !== 'All Categories') params.append('category', category);
    if (selectedSizes.length > 0) params.append('size', selectedSizes.join(','));
    if (selectedConditions.length > 0) params.append('condition', selectedConditions.join(','));
    if (brand && brand !== 'All Brands') params.append('brand', brand);
    return params.toString() ? `?${params.toString()}` : '';
  };

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:8000/api/items/${buildQuery()}`);
        if (res.ok) {
          const data = await res.json();
          setItems(data);
        } else {
          setError('Failed to fetch items');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [searchQuery, category, selectedSizes, selectedConditions, brand]);

  const categories = [
    'All Categories', 'Tops', 'Bottoms', 'Dresses', 'Jackets', 'Knitwear', 
    'Shoes', 'Accessories', 'Bags', 'Activewear', 'Formal'
  ];

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const conditions = ['Excellent', 'Good', 'Fair'];
  const brands = ['All Brands', 'Zara', 'H&M', 'Uniqlo', 'Levi\'s', 'Nike', 'Adidas'];

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': 
      case 'like new': return 'bg-success/10 text-success border-success/20';
      case 'good': return 'bg-warning/10 text-warning border-warning/20';
      case 'fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getImageUrl = (photo: string) => {
    if (!photo) return '';
    return photo.startsWith('http') ? photo : `http://localhost:8000${photo}`;
  };

  const ItemCard = ({ item }: { item: any }) => (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300 group">
      <Link to={`/item/${item.id}`}>
        <div className="aspect-square overflow-hidden relative">
          <img 
            src={getImageUrl(item.photo)} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.preventDefault();
              // Handle favorite toggle
            }}
          >
            <Heart className={`h-4 w-4 ${item.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
          <Badge className="absolute bottom-2 left-2 bg-primary">{item.points || 0} pts</Badge>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <Link to={`/item/${item.id}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
            {item.title}
          </h3>
        </Link>
        
        <div className="flex gap-2 mb-3">
          <Badge variant="outline" className="text-xs">{item.brand}</Badge>
          <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
          <Badge className={`text-xs ${getConditionColor(item.condition)}`}>{item.condition}</Badge>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Owner ID: {item.owner}</span>
            {/* You can fetch/display owner info if needed */}
          </div>
          <div className="text-xs">Created {item.created_at?.slice(0, 10)}</div>
        </div>
      </CardContent>
    </Card>
  );

  const ItemListCard = ({ item }: { item: any }) => (
    <Card className="overflow-hidden hover:shadow-medium transition-all duration-300">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link to={`/item/${item.id}`} className="flex-shrink-0">
            <img 
              src={getImageUrl(item.photo)} 
              alt={item.title}
              className="w-24 h-24 object-cover rounded-md"
            />
          </Link>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start mb-2">
              <Link to={`/item/${item.id}`}>
                <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </Link>
              <div className="flex items-center gap-2">
                <Badge className="bg-primary">{item.points || 0} pts</Badge>
                <Button variant="ghost" size="icon">
                  <Heart className={`h-4 w-4 ${item.isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-2 mb-3">
              <Badge variant="outline" className="text-xs">{item.brand}</Badge>
              <Badge variant="outline" className="text-xs">{item.category}</Badge>
              <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
              <Badge className={`text-xs ${getConditionColor(item.condition)}`}>{item.condition}</Badge>
            </div>
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-4">
                <span>Owner ID: {item.owner}</span>
                <div className="text-xs">Created {item.created_at?.slice(0, 10)}</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
          <p className="text-muted-foreground">Discover amazing preloved clothes in your area</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:block ${showFilters ? 'block' : 'hidden'} space-y-6`}>
          <Card>
            <CardContent className="p-4 space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Separator />

              {/* Category */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue>{category}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(categoryOption => (
                      <SelectItem key={categoryOption} value={categoryOption}>
                        {categoryOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <Label>Size</Label>
                <div className="grid grid-cols-3 gap-2">
                  {sizes.map(size => (
                    <div key={size} className="flex items-center space-x-2">
                      <Checkbox id={size} checked={selectedSizes.includes(size)} onCheckedChange={checked => {
                        setSelectedSizes(prev => checked ? [...prev, size] : prev.filter(s => s !== size));
                      }} />
                      <Label htmlFor={size} className="text-sm">{size}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label>Condition</Label>
                <div className="flex flex-col gap-2">
                  {conditions.map(cond => (
                    <div key={cond} className="flex items-center space-x-2">
                      <Checkbox id={cond} checked={selectedConditions.includes(cond)} onCheckedChange={checked => {
                        setSelectedConditions(prev => checked ? [...prev, cond] : prev.filter(c => c !== cond));
                      }} />
                      <Label htmlFor={cond} className="text-sm">{cond}</Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-2">
                <Label>Brand</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger>
                    <SelectValue>{brand}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map(brandOption => (
                      <SelectItem key={brandOption} value={brandOption}>
                        {brandOption}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Distance */}
              <div className="space-y-2">
                <Label>Distance</Label>
                <Select defaultValue="25">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">Within 5 miles</SelectItem>
                    <SelectItem value="10">Within 10 miles</SelectItem>
                    <SelectItem value="25">Within 25 miles</SelectItem>
                    <SelectItem value="50">Within 50 miles</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button variant="outline" className="w-full">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground">
              Showing {items.length} items
            </p>
            <Select defaultValue="recent">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="distance">Nearest First</SelectItem>
                <SelectItem value="points-low">Points: Low to High</SelectItem>
                <SelectItem value="points-high">Points: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Items Grid/List */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {items.map(item => (
                <ItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <ItemListCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Items
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Browse;