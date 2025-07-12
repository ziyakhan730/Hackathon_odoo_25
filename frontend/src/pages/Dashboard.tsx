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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { fetchWithAuth } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

const Dashboard = () => {
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [myItems, setMyItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [swaps, setSwaps] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [swapsLoading, setSwapsLoading] = useState(true);
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [swapMessages, setSwapMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
  }, [location]);

  useEffect(() => {
    const fetchItems = async () => {
      setItemsLoading(true);
      try {
        const res = await fetchWithAuth('/api/my-items/');
        if (res.ok) {
          const data = await res.json();
          setMyItems(data);
        } else {
          setMyItems([]);
        }
      } catch {
        setMyItems([]);
      } finally {
        setItemsLoading(false);
      }
    };
    fetchItems();
  }, [location]);

  useEffect(() => {
    const fetchSwaps = async () => {
      setSwapsLoading(true);
      try {
        const res = await fetchWithAuth('/api/swaps/');
        if (res.ok) {
          const data = await res.json();
          setSwaps(data.swaps);
          setUnreadCount(data.unread_count);
        } else {
          setSwaps([]);
          setUnreadCount(0);
        }
      } catch {
        setSwaps([]);
        setUnreadCount(0);
      } finally {
        setSwapsLoading(false);
      }
    };
    fetchSwaps();
  }, [location]);

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

  // Active swaps and swap history
  const activeSwaps = swaps.filter((swap: any) => ['pending', 'accepted', 'meetup_pending', 'awaiting_response'].includes(swap.status));
  const swapHistory = swaps.filter((swap: any) => ['completed', 'cancelled', 'declined'].includes(swap.status));

  // Swap detail modal logic
  const openSwapDetail = async (swap: any) => {
    setSelectedSwap(swap);
    setMessageLoading(true);
    try {
      const res = await fetchWithAuth(`/api/swaps/${swap.id}/messages/`);
      if (res.ok) {
        setSwapMessages(await res.json());
      } else {
        setSwapMessages([]);
      }
    } catch {
      setSwapMessages([]);
    } finally {
      setMessageLoading(false);
    }
  };
  const sendMessage = async () => {
    if (!selectedSwap || !newMessage.trim()) return;
    setMessageLoading(true);
    try {
      await fetchWithAuth(`/api/swaps/${selectedSwap.id}/messages/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage })
      });
      // Refresh messages
      const res = await fetchWithAuth(`/api/swaps/${selectedSwap.id}/messages/`);
      if (res.ok) setSwapMessages(await res.json());
      setNewMessage('');
    } finally {
      setMessageLoading(false);
    }
  };

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
              <Button variant="outline" size="sm" onClick={() => navigate('/my-items')}>View All</Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {itemsLoading ? (
              <div>Loading...</div>
            ) : myItems.length === 0 ? (
              <div>No items listed yet.</div>
            ) : (
              myItems.slice(0, 3).map((item: any) => (
                <Link to={`/item/${item.id}`} key={item.id} className="block">
                  <div className="flex items-center gap-3 p-3 rounded-lg border">
                    {item.photo && (
                      <img src={`http://localhost:8000${item.photo}`} alt={item.title} className="w-12 h-12 rounded-md object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{item.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={item.status === 'active' ? 'default' : item.status === 'swapped' ? 'secondary' : 'outline'} className="text-xs">
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.category}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>

        {/* Active Swaps */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CardTitle>Active Swaps</CardTitle>
                {unreadCount > 0 && <span className="ml-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs">{unreadCount}</span>}
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/swaps">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {swapsLoading ? (
              <div>Loading...</div>
            ) : activeSwaps.length === 0 ? (
              <div>No active swaps.</div>
            ) : (
              activeSwaps.slice(0, 3).map((swap: any) => (
                <div key={swap.id} className="space-y-3 p-4 rounded-lg border cursor-pointer" onClick={() => openSwapDetail(swap)}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={swap.receiver_item?.photo ? `http://localhost:8000${swap.receiver_item.photo}` : ''} 
                      alt={swap.receiver_item?.title || ''}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{swap.receiver_item?.title || ''}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={swap.receiver?.avatar || ''} />
                          <AvatarFallback className="text-xs">{swap.receiver?.full_name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          with {swap.receiver?.full_name || ''}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {swap.status === 'awaiting_response' ? (
                        <>
                          <Clock className="h-3 w-3 mr-1" /> Awaiting Response
                        </>
                      ) : swap.status === 'meetup_pending' ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" /> Pending Meetup
                        </>
                      ) : (
                        swap.status.charAt(0).toUpperCase() + swap.status.slice(1)
                      )}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={async (e) => {
                        e.stopPropagation();
                        let newStatus = swap.status === 'awaiting_response' ? 'meetup_pending' : 'completed';
                        await fetchWithAuth(`/api/swaps/${swap.id}/`, {
                          method: 'PATCH',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ status: newStatus })
                        });
                        // Refresh swaps
                        const res = await fetchWithAuth('/api/swaps/');
                        if (res.ok) {
                          const data = await res.json();
                          setSwaps(data.swaps);
                          setUnreadCount(data.unread_count);
                        }
                      }}
                    >
                      {swap.status === 'awaiting_response' ? 'Follow Up' : swap.status === 'meetup_pending' ? 'Arrange Meetup' : 'Update'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        {/* Swap History */}
        <Card>
          <CardHeader>
            <CardTitle>Swap History</CardTitle>
            <CardDescription>Completed, cancelled, and declined swaps</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {swapHistory.length === 0 ? (
              <div>No swap history yet.</div>
            ) : (
              swapHistory.slice(0, 3).map((swap: any) => (
                <div key={swap.id} className="space-y-2 p-3 rounded-lg border cursor-pointer" onClick={() => openSwapDetail(swap)}>
                  <div className="flex items-center gap-3">
                    <img 
                      src={swap.receiver_item?.photo ? `http://localhost:8000${swap.receiver_item.photo}` : ''} 
                      alt={swap.receiver_item?.title || ''}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium">{swap.receiver_item?.title || ''}</h4>
                      <span className="text-xs text-muted-foreground">{swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
        {/* Swap Detail Modal */}
        <Dialog open={!!selectedSwap} onOpenChange={() => setSelectedSwap(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Swap Details</DialogTitle>
            </DialogHeader>
            {selectedSwap && (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <img src={selectedSwap.receiver_item?.photo ? `http://localhost:8000${selectedSwap.receiver_item.photo}` : ''} alt={selectedSwap.receiver_item?.title || ''} className="w-12 h-12 rounded-md object-cover" />
                  <div>
                    <div className="font-medium">{selectedSwap.receiver_item?.title || ''}</div>
                    <div className="text-xs text-muted-foreground">with {selectedSwap.receiver?.full_name || ''}</div>
                    <div className="text-xs text-muted-foreground">Status: {selectedSwap.status}</div>
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="font-semibold mb-2">Messages</div>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {messageLoading ? (
                      <div>Loading...</div>
                    ) : swapMessages.length === 0 ? (
                      <div className="text-xs text-muted-foreground">No messages yet.</div>
                    ) : (
                      swapMessages.map((msg: any) => (
                        <div key={msg.id} className="text-sm">
                          <span className="font-semibold">{msg.sender_name}: </span>{msg.content}
                          <span className="text-xs text-muted-foreground ml-2">{new Date(msg.created_at).toLocaleString()}</span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="flex gap-2 mt-2">
                    <input
                      className="flex-1 border rounded px-2 py-1 text-sm"
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyDown={e => { if (e.key === 'Enter') sendMessage(); }}
                      disabled={messageLoading}
                    />
                    <Button onClick={sendMessage} disabled={messageLoading || !newMessage.trim()}>Send</Button>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedSwap(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
};

export default Dashboard;