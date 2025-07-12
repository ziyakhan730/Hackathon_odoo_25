import { useEffect, useState, useRef } from 'react';
import { fetchWithAuth } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Swaps = () => {
  const [swaps, setSwaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSwap, setSelectedSwap] = useState<any>(null);
  const [swapMessages, setSwapMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageLoading, setMessageLoading] = useState(false);
  const [polling, setPolling] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Get current user id from localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser?.id;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSwaps = async () => {
      setLoading(true);
      const res = await fetchWithAuth('/api/swaps/');
      if (res.ok) {
        const data = await res.json();
        setSwaps(data.swaps);
      } else {
        setSwaps([]);
      }
      setLoading(false);
    };
    fetchSwaps();
  }, []);

  const fetchMessages = async (swapId: number) => {
    setMessageLoading(true);
    try {
      const res = await fetchWithAuth(`/api/swaps/${swapId}/messages/`);
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

  // Polling for messages when modal is open
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (selectedSwap) {
      fetchMessages(selectedSwap.id);
      setPolling(true);
      interval = setInterval(() => {
        fetchMessages(selectedSwap.id);
      }, 3000);
    } else {
      setPolling(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
    // eslint-disable-next-line
  }, [selectedSwap]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [swapMessages]);

  const openSwapDetail = async (swap: any) => {
    setSelectedSwap(swap);
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
      setNewMessage('');
      // Message will be picked up by polling
    } finally {
      setMessageLoading(false);
    }
  };

  // Accept or reject swap
  const handleSwapAction = async (status: 'accepted' | 'declined') => {
    if (!selectedSwap) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/api/swaps/${selectedSwap.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      // Refresh swaps and selected swap
      const res = await fetchWithAuth('/api/swaps/');
      if (res.ok) {
        const data = await res.json();
        setSwaps(data.swaps);
        // Update selectedSwap with new status
        const updated = data.swaps.find((s: any) => s.id === selectedSwap.id);
        setSelectedSwap(updated);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteSwap = async () => {
    if (!selectedSwap) return;
    setActionLoading(true);
    try {
      await fetchWithAuth(`/api/swaps/${selectedSwap.id}/delete/`, {
        method: 'DELETE',
      });
      setSelectedSwap(null);
      // Refresh swaps
      const res = await fetchWithAuth('/api/swaps/');
      if (res.ok) {
        const data = await res.json();
        setSwaps(data.swaps);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const isProposer = selectedSwap && selectedSwap.proposer === currentUserId;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">All Swaps</h1>
      {loading ? <div>Loading...</div> : swaps.length === 0 ? <div>No swaps yet.</div> : (
        <div className="space-y-4">
          {swaps.map((swap: any) => (
            <Card key={swap.id} className="cursor-pointer" onClick={() => openSwapDetail(swap)}>
              <CardContent className="flex items-center gap-6 p-4">
                <div className="flex flex-col items-center">
                  <img src={swap.proposer_item_detail?.photo || ''} alt={swap.proposer_item_detail?.title || ''} className="w-14 h-14 rounded object-cover border" />
                  <span className="text-xs mt-1">You</span>
                </div>
                <div className="flex flex-col items-center">
                  <img src={swap.receiver_item_detail?.photo || ''} alt={swap.receiver_item_detail?.title || ''} className="w-14 h-14 rounded object-cover border" />
                  <span className="text-xs mt-1">Them</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg truncate">{swap.receiver_item_detail?.title || ''}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{new Date(swap.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm">View</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      {/* Swap Detail Modal */}
      <Dialog open={!!selectedSwap} onOpenChange={() => setSelectedSwap(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Swap Details</DialogTitle>
          </DialogHeader>
          {selectedSwap && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center">
                  <img
                    src={selectedSwap.proposer_item_detail?.photo || ''}
                    alt={selectedSwap.proposer_item_detail?.title || ''}
                    className="w-12 h-12 rounded-md object-cover cursor-pointer"
                    onClick={() => navigate(`/item/${selectedSwap.proposer_item_detail?.id}`)}
                  />
                  <span className="text-xs">You</span>
                </div>
                <div className="flex flex-col items-center">
                  <img
                    src={selectedSwap.receiver_item_detail?.photo || ''}
                    alt={selectedSwap.receiver_item_detail?.title || ''}
                    className="w-12 h-12 rounded-md object-cover cursor-pointer"
                    onClick={() => navigate(`/item/${selectedSwap.receiver_item_detail?.id}`)}
                  />
                  <span className="text-xs">Them</span>
                </div>
                <div>
                  <div className="font-medium">{selectedSwap.receiver_item_detail?.title || ''}</div>
                  <div className="text-xs text-muted-foreground">Status: {selectedSwap.status}</div>
                </div>
              </div>
              {/* Accept/Reject buttons */}
              <div className="flex gap-2 mb-2">
                <Button
                  variant="success"
                  disabled={isProposer || actionLoading || selectedSwap.status === 'accepted' || selectedSwap.status === 'declined'}
                  onClick={() => handleSwapAction('accepted')}
                >
                  Accept
                </Button>
                <Button
                  variant="destructive"
                  disabled={isProposer || actionLoading || selectedSwap.status === 'accepted' || selectedSwap.status === 'declined'}
                  onClick={() => handleSwapAction('declined')}
                >
                  Reject
                </Button>
                {selectedSwap.status === 'accepted' && <span className="text-success font-semibold ml-2">Accepted</span>}
                {selectedSwap.status === 'declined' && <span className="text-destructive font-semibold ml-2">Declined</span>}
              </div>
              <div className="border-t pt-4">
                <div className="font-semibold mb-2">Messages</div>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {messageLoading ? (
                    <div>Loading...</div>
                  ) : swapMessages.length === 0 ? (
                    <div className="text-xs text-muted-foreground">No messages yet.</div>
                  ) : (
                    swapMessages.map((msg: any) => {
                      const isMe = msg.sender === currentUserId;
                      return (
                        <div
                          key={msg.id}
                          className={`flex ${isMe ? 'justify-end' : 'justify-start'} w-full`}
                        >
                          <div
                            className={`rounded-lg px-3 py-2 max-w-xs break-words text-sm shadow ${isMe ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}
                          >
                            <span className="font-semibold mr-2">{isMe ? 'You' : msg.sender_name}:</span>
                            {msg.content}
                            <span className="block text-xs text-muted-foreground mt-1">{new Date(msg.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
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
            <Button variant="destructive" onClick={handleDeleteSwap} disabled={actionLoading}>Delete Swap</Button>
            <Button variant="outline" onClick={() => setSelectedSwap(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Swaps; 