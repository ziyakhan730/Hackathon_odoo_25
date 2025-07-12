import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Check, 
  X, 
  Eye, 
  Flag, 
  Shield, 
  Users, 
  ShoppingBag, 
  AlertTriangle,
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  MessageCircle
} from 'lucide-react';

const Admin = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for pending items
  const pendingItems = [
    {
      id: 1,
      title: "Vintage Band T-Shirt",
      category: "Tops",
      condition: "Good",
      brand: "Unknown",
      submittedBy: "Mike Johnson",
      submittedDate: "2024-01-15",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"],
      description: "Original 1990s band t-shirt from a local concert. Some fading but still in great condition.",
      flags: [],
      userRating: 4.2,
      userSwaps: 5
    },
    {
      id: 2,
      title: "Designer Handbag",
      category: "Accessories",
      condition: "Excellent",
      brand: "Coach",
      submittedBy: "Emma Wilson",
      submittedDate: "2024-01-14",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop"],
      description: "Authentic Coach handbag in perfect condition. Includes original tags and dust bag.",
      flags: ["authenticity_check"],
      userRating: 4.9,
      userSwaps: 18
    },
    {
      id: 3,
      title: "Workout Leggings",
      category: "Activewear",
      condition: "Good",
      brand: "Lululemon",
      submittedBy: "Sarah Lee",
      submittedDate: "2024-01-13",
      images: ["https://images.unsplash.com/photo-1506629905996-5b4723b1e2c5?w=200&h=200&fit=crop"],
      description: "High-quality workout leggings, gently used. Small pilling but still very functional.",
      flags: ["condition_review"],
      userRating: 4.7,
      userSwaps: 12
    }
  ];

  // Mock data for reported items
  const reportedItems = [
    {
      id: 4,
      title: "Questionable Item",
      category: "Tops",
      reportedBy: "User123",
      reportReason: "Inappropriate content",
      reportDate: "2024-01-15",
      status: "pending",
      images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop"],
      owner: "ProblematicUser"
    },
    {
      id: 5,
      title: "Damaged Shoes",
      category: "Shoes",
      reportedBy: "ConcernedUser",
      reportReason: "Item condition misrepresented",
      reportDate: "2024-01-14",
      status: "under_review",
      images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop"],
      owner: "ShoeSeller99"
    }
  ];

  // Mock data for user management
  const flaggedUsers = [
    {
      id: 1,
      name: "ProblematicUser",
      email: "problem@example.com",
      joinDate: "2023-12-01",
      totalSwaps: 3,
      rating: 2.1,
      reports: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop",
      lastActive: "2024-01-10",
      flags: ["spam", "inappropriate_items"]
    },
    {
      id: 2,
      name: "SuspiciousAccount",
      email: "sus@example.com",
      joinDate: "2024-01-01",
      totalSwaps: 0,
      rating: 0,
      reports: 2,
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b1fd?w=64&h=64&fit=crop",
      lastActive: "2024-01-12",
      flags: ["multiple_accounts"]
    }
  ];

  const stats = {
    totalUsers: 15234,
    activeItems: 8456,
    pendingReviews: pendingItems.length,
    reportsToday: 8,
    swapsToday: 127
  };

  const approveItem = (itemId: number) => {
    console.log(`Approving item ${itemId}`);
    // Implementation would update backend
  };

  const rejectItem = (itemId: number, reason: string) => {
    console.log(`Rejecting item ${itemId} with reason: ${reason}`);
    // Implementation would update backend and notify user
  };

  const handleReport = (reportId: number, action: 'resolve' | 'escalate' | 'remove') => {
    console.log(`Handling report ${reportId} with action: ${action}`);
    // Implementation would update backend
  };

  const suspendUser = (userId: number, duration: string) => {
    console.log(`Suspending user ${userId} for ${duration}`);
    // Implementation would update user status
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage the ReWear community and moderate content</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold text-primary">{stats.totalUsers.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Items</p>
                <p className="text-2xl font-bold text-accent">{stats.activeItems.toLocaleString()}</p>
              </div>
              <ShoppingBag className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Reviews</p>
                <p className="text-2xl font-bold text-warning">{stats.pendingReviews}</p>
              </div>
              <Eye className="h-8 w-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reports Today</p>
                <p className="text-2xl font-bold text-destructive">{stats.reportsToday}</p>
              </div>
              <Flag className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Swaps Today</p>
                <p className="text-2xl font-bold text-success">{stats.swapsToday}</p>
              </div>
              <Shield className="h-8 w-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pending">Pending Items ({pendingItems.length})</TabsTrigger>
          <TabsTrigger value="reports">Reports ({reportedItems.length})</TabsTrigger>
          <TabsTrigger value="users">Flagged Users ({flaggedUsers.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Pending Items Tab */}
        <TabsContent value="pending" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Items Awaiting Review</h2>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {pendingItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{item.category}</Badge>
                            <Badge variant="outline">{item.brand}</Badge>
                            <Badge variant="outline">{item.condition}</Badge>
                            {item.flags.map(flag => (
                              <Badge key={flag} variant="destructive" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <p>Submitted by {item.submittedBy}</p>
                          <p>{item.submittedDate}</p>
                          <p>Rating: {item.userRating}/5 ({item.userSwaps} swaps)</p>
                        </div>
                      </div>

                      <p className="text-sm text-muted-foreground">{item.description}</p>

                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageCircle className="mr-2 h-4 w-4" />
                            Contact User
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const reason = prompt("Reason for rejection:");
                              if (reason) rejectItem(item.id, reason);
                            }}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => approveItem(item.id)}
                          >
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-4">
          <h2 className="text-xl font-semibold">Reported Content</h2>
          
          <div className="space-y-4">
            {reportedItems.map((report) => (
              <Card key={report.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <img
                      src={report.images[0]}
                      alt={report.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{report.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Owned by {report.owner} • Reported by {report.reportedBy}
                          </p>
                        </div>
                        <Badge variant={report.status === 'pending' ? 'destructive' : 'secondary'}>
                          {report.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-lg mb-3">
                        <p className="text-sm">
                          <strong>Report Reason:</strong> {report.reportReason}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reported on {report.reportDate}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleReport(report.id, 'resolve')}
                        >
                          Resolve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleReport(report.id, 'remove')}
                        >
                          Remove Item
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleReport(report.id, 'escalate')}
                        >
                          Escalate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Flagged Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <h2 className="text-xl font-semibold">Flagged Users</h2>
          
          <div className="space-y-4">
            {flaggedUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{user.name}</h3>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <div className="flex gap-2 mt-1">
                            {user.flags.map(flag => (
                              <Badge key={flag} variant="destructive" className="text-xs">
                                {flag.replace('_', ' ')}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground text-right">
                          <p>Joined: {user.joinDate}</p>
                          <p>Last active: {user.lastActive}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 mb-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Total Swaps</p>
                          <p className="font-semibold">{user.totalSwaps}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Rating</p>
                          <p className="font-semibold">{user.rating}/5</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Reports</p>
                          <p className="font-semibold text-destructive">{user.reports}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-semibold text-warning">Flagged</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="mr-2 h-4 w-4" />
                          Send Warning
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const duration = prompt("Suspension duration (days):");
                            if (duration) suspendUser(user.id, duration);
                          }}
                        >
                          <AlertTriangle className="mr-2 h-4 w-4" />
                          Suspend
                        </Button>
                        <Button variant="destructive" size="sm">
                          <Ban className="mr-2 h-4 w-4" />
                          Ban User
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Moderation Settings</CardTitle>
              <CardDescription>Configure automatic moderation and review policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="auto-review">Auto-review threshold (user rating)</Label>
                <Input id="auto-review" type="number" defaultValue="4.5" step="0.1" min="0" max="5" />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="flag-threshold">Auto-flag threshold (reports)</Label>
                <Input id="flag-threshold" type="number" defaultValue="3" min="1" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banned-words">Banned words/phrases</Label>
                <Textarea 
                  id="banned-words" 
                  placeholder="Enter banned words separated by commas"
                  rows={3}
                />
              </div>

              <Button variant="default">Save Settings</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community Guidelines</CardTitle>
              <CardDescription>Update the community guidelines and policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Enter community guidelines..."
                rows={10}
                defaultValue="1. All items must be clean and in good condition
2. Provide accurate descriptions and photos
3. Be respectful in all communications
4. No commercial selling - this is for personal items only
5. Report any suspicious or inappropriate content"
              />
              <Button variant="default">Update Guidelines</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;