import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/components/ui/feedback';
import { Camera, MapPin, User, FileText, AtSign } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

export function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        username: profile.username,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        location: profile.location,
      })
      .eq('id', profile.id);

    if (error) {
      if (error.message.includes('unique constraint') && error.message.includes('username')) {
        setFeedback({ 
          type: 'error', 
          message: 'This username is already taken. Please choose another one.' 
        });
      } else {
        setFeedback({ 
          type: 'error', 
          message: 'System error: Failed to update profile. Please try again.' 
        });
      }
    } else {
      setFeedback({ 
        type: 'success', 
        message: 'Your scout profile has been synchronized successfully.' 
      });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <form onSubmit={handleUpdate} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center gap-4 pb-4">
          <div className="relative group">
            <div className="h-24 w-24 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all group-hover:border-primary/50">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User className="h-10 w-10 text-muted/30" />
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
          <div className="w-full max-w-xs space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted/50 px-1">
              Avatar Image URL
            </label>
            <Input
              placeholder="https://images.com/your-avatar.jpg"
              value={profile.avatar_url || ''}
              onChange={(e) => setProfile({ ...profile, avatar_url: e.target.value })}
              className="h-10 text-xs bg-background/40"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted/50 px-1 flex items-center gap-1.5">
              <User className="h-3 w-3" /> Full Name
            </label>
            <Input
              placeholder="Enter your full name"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="h-12 bg-background/50"
            />
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted/50 px-1 flex items-center gap-1.5">
              <AtSign className="h-3 w-3" /> Username
            </label>
            <Input
              placeholder="scout_id"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="h-12 bg-background/50"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted/50 px-1 flex items-center gap-1.5">
            <MapPin className="h-3 w-3" /> Location
          </label>
          <Input
            placeholder="e.g. Nakuru, Kenya"
            value={profile.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="h-12 bg-background/50"
          />
        </div>

        {/* Bio */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted/50 px-1 flex items-center gap-1.5">
            <FileText className="h-3 w-3" /> Bio & Mission
          </label>
          <textarea
            rows={3}
            placeholder="Tell your AI scout what you're looking for..."
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full rounded-xl bg-background/50 border border-white/10 px-4 py-3 text-sm focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none transition-all placeholder:text-muted/30"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-14 text-sm font-bold rounded-2xl shadow-xl shadow-primary/10 group"
        >
          {loading ? (
            <div className="h-5 w-5 border-2 border-background border-t-transparent rounded-full animate-spin" />
          ) : (
            "Update Scout Profile"
          )}
        </Button>
      </form>
    </div>
  );
}
