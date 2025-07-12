import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchWithAuth } from '@/lib/utils';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';

const MyItems = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [deleting, setDeleting] = useState(false);
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

  const handleSelect = (id: number) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
      setSelectAll(false);
    } else {
      setSelectedItems(items.map((item: any) => item.id));
      setSelectAll(true);
    }
  };

  const handleDelete = async (ids: number[]) => {
    if (!window.confirm('Are you sure you want to delete the selected item(s)?')) return;
    setDeleting(true);
    for (const id of ids) {
      await fetchWithAuth(`/api/items/${id}/`, { method: 'DELETE' });
    }
    setItems(items.filter((item: any) => !ids.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);
    setDeleting(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Listed Items</h1>
        <div className="flex items-center gap-2">
          <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
          <span className="text-sm">Select All</span>
          {selectedItems.length > 0 && (
            <Button variant="destructive" size="sm" onClick={() => handleDelete(selectedItems)} disabled={deleting}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete Selected
            </Button>
          )}
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-4">
        {items.map((item: any) => (
          <Card key={item.id} className="relative">
            <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
              <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={() => handleSelect(item.id)} />
              <Button variant="ghost" size="icon" onClick={() => handleDelete([item.id])} disabled={deleting}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Link to={`/item/${item.id}`} className="block">
              <CardContent className="flex items-center gap-4 p-4">
                {item.photo && (
                  <img
                    src={item.photo.startsWith('http') ? item.photo : `http://localhost:8000${item.photo}`}
                    alt={item.title}
                    className="w-16 h-16 rounded object-cover border"
                  />
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