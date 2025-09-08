import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserPresenceProps {
  user: User | null;
}

export const UserPresence = ({ user }: UserPresenceProps) => {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<Date | null>(null);

  useEffect(() => {
    if (!user) return;

    // Set up presence tracking
    const channel = supabase.channel('user-presence')
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users = Object.keys(newState);
        setIsOnline(users.includes(user.id));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        if (key === user.id) {
          setIsOnline(true);
        }
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        if (key === user.id) {
          setIsOnline(false);
          setLastSeen(new Date());
        }
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Track current user's presence
          await channel.track({
            user_id: user.id,
            email: user.email,
            online_at: new Date().toISOString(),
          });
        }
      });

    // Update online status periodically
    const interval = setInterval(async () => {
      if (channel.state === 'joined') {
        await channel.track({
          user_id: user.id,
          email: user.email,
          online_at: new Date().toISOString(),
        });
      }
    }, 30000); // Update every 30 seconds

    // Handle visibility changes
    const handleVisibilityChange = async () => {
      if (document.hidden) {
        setIsOnline(false);
        setLastSeen(new Date());
      } else {
        await channel.track({
          user_id: user.id,
          email: user.email,
          online_at: new Date().toISOString(),
        });
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      channel.unsubscribe();
    };
  }, [user]);

  if (!user) return null;

  const formatLastSeen = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
      <Badge variant={isOnline ? "default" : "secondary"} className="text-xs">
        {isOnline ? 'Online' : lastSeen ? `Last seen ${formatLastSeen(lastSeen)}` : 'Offline'}
      </Badge>
    </div>
  );
};