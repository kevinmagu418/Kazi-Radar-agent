import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/components/ui/feedback';
import { MapPin, User, FileText, AtSign, Save } from 'lucide-react';
import { AvatarUpload } from './AvatarUpload';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

export function ProfileForm({ initialProfile, onComplete }: { initialProfile: Profile, onComplete?: () => void }) {
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
      if (onComplete) onComplete();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <form onSubmit={handleUpdate} className="space-y-8">
        {/* Avatar Section */}
        <div className="flex justify-center">
          <AvatarUpload 
            uid={profile.id} 
            url={profile.avatar_url} 
            onUpload={(url) => setProfile({ ...profile, avatar_url: url })} 
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50 px-1 flex items-center gap-2">
              <User className="h-3 w-3 text-primary" /> Full Name
            </label>
            <Input
              placeholder="Enter your full name"
              value={profile.full_name || ''}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              className="h-14 bg-background/50 border-white/5 focus:border-primary/30 transition-all rounded-2xl"
            />
          </div>

          {/* Username */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50 px-1 flex items-center gap-2">
              <AtSign className="h-3 w-3 text-primary" /> Username
            </label>
            <Input
              placeholder="scout_id"
              value={profile.username || ''}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="h-14 bg-background/50 border-white/5 focus:border-primary/30 transition-all rounded-2xl"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50 px-1 flex items-center gap-2">
            <MapPin className="h-3 w-3 text-primary" /> Location
          </label>
          <Input
            placeholder="e.g. Nairobi, Kenya"
            value={profile.location || ''}
            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            className="h-14 bg-background/50 border-white/5 focus:border-primary/30 transition-all rounded-2xl"
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted/50 px-1 flex items-center gap-2">
            <FileText className="h-3 w-3 text-primary" /> Bio & Intelligence Mission
          </label>
          <textarea
            rows={4}
            placeholder="What kind of opportunities are you hunting for?"
            value={profile.bio || ''}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="w-full rounded-[2rem] bg-background/50 border border-white/5 px-6 py-4 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted/20"
          />
        </div>

        <Button 
          type="submit" 
          disabled={loading} 
          className="w-full h-16 text-base font-bold rounded-2xl shadow-2xl shadow-primary/20 group relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="relative z-10 flex items-center justify-center gap-2">
            {loading ? (
              <div className="h-6 w-6 border-3 border-background border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="h-5 w-5" />
                Synchronize Profile
              </>
            )}
          </span>
        </Button>
      </form>
    </div>
  );
}
