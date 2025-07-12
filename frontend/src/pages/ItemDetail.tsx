import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Heart, 
  Share2, 
  Star, 
  MapPin, 
  Calendar,
  Coins,
  ArrowLeftRight,
  MessageCircle,
  Shield,
  Truck,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Link } from 'react-router-dom';

const ItemDetail = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);

  const item = {
    id: 1,
    title: "Vintage Denim Jacket",
    description: "Beautiful vintage denim jacket in excellent condition. This classic piece features authentic fading and a perfect fit. Originally from a premium brand, it's been well-cared for and is ready for its next adventure. Perfect for layering and adding a timeless touch to any outfit.",
    category: "Jackets",
    subcategory: "Denim",
    size: "M",
    condition: "Excellent",
    brand: "Levi's",
    color: "Blue",
    points: 25,
    tags: ["vintage", "classic", "casual", "layering"],
    images: [
      "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=600&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&h=600&fit=crop&crop=center"
    ],
    owner: {
      name: "Sarah Miller",
      rating: 4.8,
      totalSwaps: 24,
      memberSince: "March 2024",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=64&h=64&fit=crop&crop=center",
      location: "San Francisco, CA",
      responseTime: "Usually responds within 2 hours"
    },
    availability: "available",
    postedDate: "2 days ago",
    measurements: {
      chest: "42 inches",
      length: "26 inches",
      sleeve: "24 inches"
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % item.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + item.images.length) % item.images.length);
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'excellent': return 'bg-success/10 text-success border-success/20';
      case 'good': return 'bg-warning/10 text-warning border-warning/20';
      case 'fair': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/browse" className="hover:text-primary transition-colors">Browse</Link>
        <span>/</span>
        <Link to={`/browse?category=${item.category}`} className="hover:text-primary transition-colors">
          {item.category}
        </Link>
        <span>/</span>
        <span className="text-foreground">{item.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={item.images[currentImageIndex]} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {item.images.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    index === currentImageIndex ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{item.brand}</Badge>
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge className={getConditionColor(item.condition)}>{item.condition}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsFavorited(!isFavorited)}
                >
                  <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
              <span>Size: {item.size}</span>
              <span>•</span>
              <span>Color: {item.color}</span>
              <span>•</span>
              <span>Posted {item.postedDate}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{item.description}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gradient-secondary rounded-lg">
              <div>
                <div className="font-semibold">Redeem with Points</div>
                <div className="text-sm text-muted-foreground">Use your earned points</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary flex items-center gap-1">
                    <Coins className="h-5 w-5" />
                    {item.points}
                  </div>
                  <div className="text-xs text-muted-foreground">points</div>
                </div>
                <Button variant="default">Redeem</Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <div className="font-semibold">Propose a Swap</div>
                <div className="text-sm text-muted-foreground">Exchange with one of your items</div>
              </div>
              <Button variant="outline">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Swap Request
              </Button>
            </div>

            <Button variant="ghost" className="w-full">
              <MessageCircle className="mr-2 h-4 w-4" />
              Message Owner
            </Button>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Quality verified</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Truck className="h-4 w-4" />
              <span>Local pickup preferred</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Item Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Measurements</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Chest: {item.measurements.chest}</div>
                    <div>Length: {item.measurements.length}</div>
                    <div>Sleeve: {item.measurements.sleeve}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Care Instructions</h4>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div>Machine wash cold</div>
                    <div>Tumble dry low</div>
                    <div>Do not bleach</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Swap Guidelines</CardTitle>
              <CardDescription>How exchanges work on ReWear</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">1</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Request or Redeem</p>
                  <p>Choose to swap an item or use points to redeem</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">2</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Coordinate</p>
                  <p>Arrange a safe meeting location or shipping</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-semibold text-xs">3</span>
                </div>
                <div>
                  <p className="font-medium text-foreground">Complete</p>
                  <p>Confirm the exchange and rate your experience</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Owner Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Item Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={item.owner.avatar} />
                <AvatarFallback>{item.owner.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{item.owner.name}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span>{item.owner.rating}</span>
                  <span className="text-muted-foreground">({item.owner.totalSwaps} swaps)</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Member since {item.owner.memberSince}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.owner.location}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{item.owner.responseTime}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ItemDetail;