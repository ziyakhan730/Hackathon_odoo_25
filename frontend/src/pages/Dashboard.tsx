import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Coins, 
  ShoppingBag, 
  TrendingUp, 
  Leaf, 
  Star,
  Clock,
  CheckCircle,
  Plus,
  Edit,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { fetchWithAuth } from '@/lib/utils';

const Dashboard = () => {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchWithAuth('/api/user/');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setError('Failed to fetch user info');
        }
      } catch (err) {
        setError('Network error');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const userStats = {
    points: 145,
    itemsListed: 12,
    swapsCompleted: 8,
    co2Saved: 15.2,
    rating: 4.8,
    level: "Eco Warrior"
  };

  const recentItems = [
    {
      id: 1,
      title: "Vintage Leather Jacket",
      category: "Jackets",
      status: "active",
      views: 24,
      interested: 3,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 2,
      title: "Designer Silk Scarf",
      category: "Accessories",
      status: "swapped",
      views: 18,
      interested: 5,
      image: "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop&crop=center"
    },
    {
      id: 3,
      title: "Cozy Knit Sweater",
      category: "Knitwear",
      status: "pending",
      views: 31,
      interested: 7,
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=100&h=100&fit=crop&crop=center"
    }
  ];

  const activeSwaps = [
    {
      id: 1,
      type: "outgoing",
      item: "Summer Floral Dress",
      with: "Emma K.",
      status: "awaiting_response",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=80&h=80&fit=crop&crop=center",
      userImage: "https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=40&h=40&fit=crop&crop=center"
    },
    {
      id: 2,
      type: "incoming",
      item: "Classic Denim Jeans",
      with: "Alex R.",
      status: "pending_meetup",
      image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=80&h=80&fit=crop&crop=center",
      userImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=center"
    }
  ];

  const achievements = [
    { name: "First Swap", completed: true, icon: "🤝" },
    { name: "Eco Warrior", completed: true, icon: "🌱" },
    { name: "Style Curator", completed: false, icon: "✨" },
    { name: "Community Builder", completed: false, icon: "👥" }
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {loading ? 'Loading...' : user ? `Welcome back, ${user.full_name}!` : 'Welcome!'}
          </h1>
          <p className="text-muted-foreground">Here's what's happening with your sustainable wardrobe</p>
        </div>
        <Button variant="hero" asChild>
          <Link to="/add-item">
            <Plus className="mr-2" /> List New Item
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-primary text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80">ReWear Points</p>
                <p className="text-3xl font-bold">{userStats.points}</p>
              </div>
              <Coins className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Items Listed</p>
                <p className="text-3xl font-bold text-primary">{userStats.itemsListed}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">Successful Swaps</p>
                <p className="text-3xl font-bold text-success">{userStats.swapsCompleted}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground">CO₂ Saved</p>
                <p className="text-3xl font-bold text-accent">{userStats.co2Saved}kg</p>
              </div>
              <Leaf className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile & Progress */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=64&h=64&fit=crop&crop=center" />
                  <AvatarFallback>{user ? user.full_name[0] : '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{user ? user.full_name : '...'}</h3>
                  <p className="text-muted-foreground">{user ? user.email : ''}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-warning text-warning" />
                    <span className="text-sm font-medium">{userStats.rating}</span>
                    <span className="text-sm text-muted-foreground">(24 reviews)</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Level Progress</span>
                  <span>{userStats.level}</span>
                </div>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  4 more swaps to reach "Sustainability Champion"
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
              <CardDescription>Your sustainability milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-3 rounded-lg text-center border ${
                      achievement.completed 
                        ? 'bg-success/10 border-success/20' 
                        : 'bg-muted border-border'
                    }`}
                  >
                    <div className="text-2xl mb-1">{achievement.icon}</div>
                    <div className="text-xs font-medium">{achievement.name}</div>
                    {achievement.completed && (
                      <CheckCircle className="h-3 w-3 text-success mx-auto mt-1" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* My Items */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>My Items</CardTitle>
                <CardDescription>Manage your listed items</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/my-items">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentItems.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg border">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-12 h-12 rounded-md object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge 
                      variant={
                        item.status === 'active' ? 'default' :
                        item.status === 'swapped' ? 'secondary' : 'outline'
                      }
                      className="text-xs"
                    >
                      {item.status === 'active' ? 'Active' :
                       item.status === 'swapped' ? 'Swapped' : 'Pending'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      <Eye className="inline h-3 w-3 mr-1" />{item.views}
                    </span>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {item.interested} interested
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Swaps */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Active Swaps</CardTitle>
                <CardDescription>Ongoing exchanges</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/swaps">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeSwaps.map((swap) => (
              <div key={swap.id} className="space-y-3 p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <img 
                    src={swap.image} 
                    alt={swap.item}
                    className="w-12 h-12 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{swap.item}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={swap.userImage} />
                        <AvatarFallback className="text-xs">{swap.with[0]}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {swap.type === 'outgoing' ? 'with' : 'from'} {swap.with}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-xs">
                    {swap.status === 'awaiting_response' ? (
                      <>
                        <Clock className="h-3 w-3 mr-1" />
                        Awaiting Response
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Pending Meetup
                      </>
                    )}
                  </Badge>
                  <Button variant="outline" size="sm">
                    {swap.status === 'awaiting_response' ? 'Follow Up' : 'Arrange Meetup'}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default Dashboard;