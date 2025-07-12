import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  Recycle, 
  Users, 
  Coins, 
  Leaf, 
  Heart,
  ShoppingBag,
  Plus,
  Search,
  Star,
  CheckCircle,
  TrendingUp
} from 'lucide-react';
import heroImage from '@/assets/hero-image.jpg';

const Landing = () => {
  const [featuredItems, setFeaturedItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:8000/api/items/');
        if (res.ok) {
          const data = await res.json();
          setFeaturedItems(data.slice(0, 4));
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
  }, []);

  const stats = [
    { label: "Active Members", value: "15K+", icon: Users },
    { label: "Items Exchanged", value: "50K+", icon: Recycle },
    { label: "CO2 Saved", value: "2.5T", icon: Leaf },
    { label: "Satisfaction Rate", value: "98%", icon: Heart }
  ];

  const features = [
    {
      icon: ShoppingBag,
      title: "Direct Swaps",
      description: "Exchange items directly with other members in your community"
    },
    {
      icon: Coins,
      title: "Point System",
      description: "Earn points by listing items and redeem them for clothes you love"
    },
    {
      icon: CheckCircle,
      title: "Quality Assured",
      description: "All items are reviewed to ensure quality and accurate descriptions"
    },
    {
      icon: TrendingUp,
      title: "Sustainable Impact",
      description: "Track your environmental impact and contribution to reducing waste"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Refresh Your Wardrobe
            <span className="block text-accent-light">Sustainably</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join the community clothing exchange. Swap, redeem, and discover amazing clothes while reducing textile waste.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" asChild>
              <Link to="/auth">
                Start Swapping <ArrowRight className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-black hover:bg-white hover:text-primary" asChild>
              <Link to="/browse">
                <Search className="mr-2" /> Browse Items
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mb-4">
                  <stat.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How ReWear Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A simple, sustainable way to refresh your wardrobe while helping the environment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center border-none shadow-medium hover:shadow-strong transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-secondary rounded-full mb-4">
                    <feature.icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Items</h2>
              <p className="text-xl text-muted-foreground">
                Discover amazing pieces shared by our community
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/browse">
                View All <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading ? (
              <div className="col-span-4 text-center">Loading...</div>
            ) : error ? (
              <div className="col-span-4 text-center text-red-500">{error}</div>
            ) : featuredItems.length === 0 ? (
              <div className="col-span-4 text-center">No featured items yet.</div>
            ) : (
              featuredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden hover:shadow-medium transition-all duration-300 group">
                  <div className="aspect-square overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img
                        src={item.images[0].startsWith('http') ? item.images[0] : `http://localhost:8000${item.images[0]}`}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <img
                        src={item.photo && (item.photo.startsWith('http') ? item.photo : `http://localhost:8000${item.photo}`)}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{item.title}</h3>
                      <Badge variant="secondary">{item.points || 0} pts</Badge>
                    </div>
                    <div className="flex gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">{item.category}</Badge>
                      <Badge variant="outline" className="text-xs">Size {item.size}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Owner ID: {item.owner}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="text-sm text-muted-foreground">{item.condition}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your Sustainable Fashion Journey?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of fashion-conscious individuals making a positive impact on the environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="xl" asChild>
              <Link to="/auth">
                <Plus className="mr-2" /> Join ReWear
              </Link>
            </Button>
            <Button variant="outline" size="xl" className="border-white text-black hover:bg-white hover:text-primary" asChild>
              <Link to="/how-it-works">
                Learn More
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;