import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchWithAuth } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetchWithAuth('/api/my-items/');
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
  }, [location]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">My Listed Items</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        {items.map((item: any) => (
          <Card key={item.id}>
            <Link to={`/item/${item.id}`} className="block">
              <CardContent className="flex items-center gap-4 p-4">
                {item.photo && (
                  <img src={`http://localhost:8000${item.photo}`} alt={item.title} className="w-16 h-16 rounded object-cover border" />
                )}
                <div className="flex-1 min-w-0">
                  <h2 className="font-semibold text-lg truncate">{item.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={item.status === 'active' ? 'default' : item.status === 'swapped' ? 'secondary' : 'outline'} className="text-xs">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 truncate">{item.description}</div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
        {!loading && items.length === 0 && <div>No items listed yet.</div>}
      </div>
    </div>
  );
};

export default MyItems; 