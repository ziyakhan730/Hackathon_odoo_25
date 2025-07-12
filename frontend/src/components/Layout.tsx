import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf, User, LogOut, ShoppingBag, Plus, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Leaf className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ReWear</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/browse" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/browse') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Browse Items
            </Link>
            <Link 
              to="/add-item" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/add-item') ? "text-primary" : "text-muted-foreground"
              )}
            >
              List an Item
            </Link>
            <Link 
              to="/dashboard" 
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                isActive('/dashboard') ? "text-primary" : "text-muted-foreground"
              )}
            >
              Dashboard
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <User className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Leaf className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold">ReWear</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Sustainable fashion through community clothing exchange. Reduce waste, refresh your wardrobe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/browse" className="hover:text-primary transition-colors">Browse Items</Link></li>
                <li><Link to="/add-item" className="hover:text-primary transition-colors">List an Item</Link></li>
                <li><Link to="/how-it-works" className="hover:text-primary transition-colors">How it Works</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                <li><Link to="/safety" className="hover:text-primary transition-colors">Safety Guidelines</Link></li>
                <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/sustainability" className="hover:text-primary transition-colors">Sustainability</Link></li>
                <li><Link to="/stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
                <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 ReWear. All rights reserved. Building a sustainable future, one exchange at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};