import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
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
  User,
  CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Dialog as AlertDialog } from '@/components/ui/dialog';
import { fetchWithAuth } from '@/lib/utils';

const getImageUrl = (photo: string) => {
  if (!photo) return '';
  return photo.startsWith('http') ? photo : `http://localhost:8000${photo}`;
};

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [myItems, setMyItems] = useState<any[]>([]);
  const [selectedMyItem, setSelectedMyItem] = useState<number | null>(null);
  const [swapLoading, setSwapLoading] = useState(false);
  const [swapMessage, setSwapMessage] = useState('');
  const [showOwnSwapAlert, setShowOwnSwapAlert] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:8000/api/items/${id}/`);
        if (res.ok) {
          const data = await res.json();
          setItem(data);
        } else {
          let msg = 'Item not found or not authorized.';
          try {
            const errData = await res.json();
            if (errData && errData.detail) msg = errData.detail;
          } catch {}
          setError(msg);
        }
      } catch (e: any) {
        setError(e?.message || 'Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
  if (error) return <div className="container mx-auto px-4 py-8 text-red-500 font-semibold text-center">{error}</div>;
  if (!item) return <div className="container mx-auto px-4 py-8 text-center">Item not found.</div>;

  // Remove the debugPanel and its rendering

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

  // For tags, handle both array and string
  const tags = Array.isArray(item.tags) ? item.tags : (item.tags ? item.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : []);

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwnItem = item.owner === currentUser.id;

  const openSwapModal = async () => {
    if (isOwnItem) {
      setShowOwnSwapAlert(true);
      return;
    }
    setShowSwapModal(true);
    setSwapMessage('');
    setSelectedMyItem(null);
    // Fetch user's available items (not in active swaps)
    try {
      const res = await fetchWithAuth('/api/available-items/');
      if (res.ok) {
        setMyItems(await res.json());
      } else {
        setMyItems([]);
      }
    } catch {
      setMyItems([]);
    }
  };

  const handleProposeSwap = async () => {
    if (!selectedMyItem) return;
    setSwapLoading(true);
    setSwapMessage('');
    try {
      const res = await fetchWithAuth('/api/swaps/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposer_item: selectedMyItem,
          receiver_item: item.id,
          receiver: item.owner
        })
      });
      if (res.ok) {
        setSwapMessage('Swap proposal sent!');
        setShowSwapModal(false);
      } else {
        setSwapMessage('Failed to propose swap.');
      }
    } catch {
      setSwapMessage('Network error.');
    } finally {
      setSwapLoading(false);
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
          {/* For the image gallery, just show the main photo */}
          <div className="relative group">
            <div className="aspect-square rounded-lg overflow-hidden bg-muted">
              <img 
                src={getImageUrl(item.photo)} 
                alt={item.title || 'Item photo'}
                className="w-full h-full object-cover"
                onError={e => (e.currentTarget.style.display = 'none')}
              />
            </div>
            
            {/* {item.images.length > 1 && (
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
            )} */}
          </div>

          {/* Thumbnail Navigation */}
          {/* {item.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {item.images.map((image: string, index: number) => (
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
          )} */}
        </div>

        {/* Item Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{item.title || 'No title'}</h1>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{item.brand || 'No brand'}</Badge>
                  <Badge variant="outline">{item.category || 'No category'}</Badge>
                  <Badge className={getConditionColor(item.condition || '-')}>{item.condition || '-'}</Badge>
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
              <span>Size: {item.size || '-'}</span>
              <span>•</span>
              <span>Color: {item.color || '-'}</span>
              <span>•</span>
              <span>Posted {item.postedDate || '-'}</span>
            </div>

            <p className="text-muted-foreground leading-relaxed">{item.description || 'No description'}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.length > 0 ? tags.map((tag: string) => (
              <Badge key={tag} variant="secondary" className="text-xs">#{tag}</Badge>
            )) : <span className="text-xs text-muted-foreground">No tags</span>}
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
                    {item.points || 0}
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
              <Button variant="outline" onClick={openSwapModal}>
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
                    <div>Chest: {item.measurements?.chest || '-'}</div>
                    <div>Length: {item.measurements?.length || '-'}</div>
                    <div>Sleeve: {item.measurements?.sleeve || '-'}</div>
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
                <AvatarImage src={item.owner?.avatar || ''} />
                <AvatarFallback>{item.owner?.name?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{item.owner?.name || 'No Name'}</h3>
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span>{item.owner?.rating || 0}</span>
                  <span className="text-muted-foreground">({item.owner?.totalSwaps || 0} swaps)</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Member since {item.owner?.memberSince || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{item.owner?.location || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span>{item.owner?.responseTime || '-'}</span>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Button>
          </CardContent>
        </Card>
      </div>
      <Dialog open={showSwapModal} onOpenChange={setShowSwapModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select one of your items to swap</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {myItems.length === 0 ? (
              <div>You have no items to offer.</div>
            ) : (
              myItems.map((myItem: any) => (
                <div
                  key={myItem.id}
                  className={`flex items-center gap-3 p-2 rounded cursor-pointer border ${selectedMyItem === myItem.id ? 'border-primary bg-primary/10' : 'border-border'}`}
                  onClick={() => setSelectedMyItem(myItem.id)}
                >
                  <img src={`http://localhost:8000${myItem.photo}`} alt={myItem.title} className="w-10 h-10 rounded object-cover" />
                  <div className="flex-1">
                    <div className="font-medium">{myItem.title}</div>
                    <div className="text-xs text-muted-foreground">{myItem.category}</div>
                  </div>
                  {selectedMyItem === myItem.id && <CheckCircle className="text-primary" />}
                </div>
              ))
            )}
          </div>
          {swapMessage && <div className="text-red-500 text-center mt-2">{swapMessage}</div>}
          <DialogFooter>
            <Button onClick={handleProposeSwap} disabled={!selectedMyItem || swapLoading}>
              {swapLoading ? 'Proposing...' : 'Propose Swap'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AlertDialog open={showOwnSwapAlert} onOpenChange={setShowOwnSwapAlert}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cannot Swap Your Own Item</DialogTitle>
          </DialogHeader>
          <div>You cannot propose a swap with your own item.</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOwnSwapAlert(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </AlertDialog>
    </div>
  );
};

export default ItemDetail;