import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/components/ui/feedback';
import { MapPin, User, FileText, AtSign, Save, Loader2 } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
}

export function ProfileForm({ initialProfile, onComplete }: { initialProfile: Profile, onComplete?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialProfile || {
    id: '',
    full_name: '',
    username: '',
    avatar_url: null,
    bio: '',
    location: ''
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    // If guest, just call onComplete
    if (profile.id === 'guest' || !profile.id) {
      if (onComplete) onComplete();
      setLoading(false);
      return;
    }

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
      router.refresh(); // Refresh the layout to update UserMenu name
      if (onComplete) onComplete();
    }
    setLoading(false);
  };

  return (
    <div className="space-y-12">
      {feedback && <Feedback type={feedback.type} message={feedback.message} />}

      <form onSubmit={handleUpdate} className="space-y-10">
        <div className="grid grid-cols-1 gap-10">
          {/* Identity Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                <User className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Identity Signal</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5"> {/* Standardized 10px (2.5) spacing for better breathing room */}
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                  Full Name
                </label>
                <Input
                  placeholder="Enter your full name"
                  value={profile.full_name || ''}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="h-12 bg-surface/50 border-border/50 focus:border-primary/30 transition-all rounded-xl text-sm"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                  Scout Identifier
                </label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted/30" />
                  <Input
                    placeholder="scout_id"
                    value={profile.username || ''}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    className="h-12 pl-11 bg-surface/50 border-border/50 focus:border-primary/30 transition-all rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Localization Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                <MapPin className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Geographic Focus</h4>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                Base Operations
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted/30" />
                <Input
                  placeholder="e.g. Nairobi, Kenya"
                  value={profile.location || ''}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="h-12 pl-11 bg-surface/50 border-border/50 focus:border-primary/30 transition-all rounded-xl text-sm"
                />
              </div>
            </div>
          </section>

          {/* Intel Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-border/50 pb-3">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                <FileText className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Intelligence Brief</h4>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                Mission Statement (Entrepreneurial)
              </label>
              <textarea
                rows={4}
                placeholder="Describe your entrepreneurial goals and the opportunities you are hunting for..."
                value={profile.bio || ''}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full rounded-2xl bg-surface/50 border border-border/50 px-5 py-5 text-sm focus:border-primary/30 focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted/20 min-h-[140px] leading-relaxed"
              />
            </div>
          </section>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full h-14 text-sm font-bold rounded-xl shadow-xl shadow-primary/10 group relative overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-glow opacity-90 group-hover:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Synchronize Data
                </>
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  );
}
