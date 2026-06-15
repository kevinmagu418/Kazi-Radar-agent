import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Feedback } from '@/components/ui/feedback';
import { MapPin, User, FileText, AtSign, Save, Loader2, Globe, ChevronDown, Check } from 'lucide-react';
import { COUNTRIES } from '@/lib/countries';
import { cn } from '@/lib/utils';

interface Profile {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  location: string | null;
  onboarding_role?: string | null;
}

export function ProfileForm({ initialProfile, onComplete }: { initialProfile: Profile, onComplete?: () => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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

  // Parse location into city and country code
  // Format: "City, CC"
  const locationParts = profile.location?.split(', ') || [];
  const initialCity = locationParts.length > 1 ? locationParts[0] : (profile.location || '');
  const initialCountryCode = locationParts.length > 1 ? locationParts[1] : '';

  const [city, setCity] = useState(initialCity);
  const [selectedCountry, setSelectedCountry] = useState(
    COUNTRIES.find(c => c.code === initialCountryCode) || COUNTRIES.find(c => c.name === 'Kenya') || COUNTRIES[0]
  );

  const filteredCountries = useMemo(() => {
    if (!searchQuery) return COUNTRIES;
    return COUNTRIES.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      c.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const fullLocation = `${city}, ${selectedCountry.code}`;

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
        location: fullLocation,
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
      router.refresh();
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
              <div className="space-y-2.5">
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
                <Globe className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground/80">Geographic Focus</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                  Base Country
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="w-full h-12 flex items-center justify-between px-5 bg-surface/50 border border-border/50 rounded-xl text-sm hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{selectedCountry.flag}</span>
                      <span className="font-medium">{selectedCountry.name}</span>
                    </div>
                    <ChevronDown className={cn("h-4 w-4 text-muted/40 transition-transform", showCountryPicker && "rotate-180")} />
                  </button>

                  {showCountryPicker && (
                    <div className="absolute top-full left-0 right-0 mt-2 p-2 bg-surface border border-border/50 rounded-2xl shadow-2xl z-50 max-h-64 overflow-y-auto backdrop-blur-xl">
                      <input 
                        type="text"
                        placeholder="Search countries..."
                        className="w-full bg-surface/50 border-b border-border/30 px-4 py-3 text-xs outline-none focus:text-primary transition-colors"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                      />
                      <div className="mt-2 space-y-1">
                        {filteredCountries.map(country => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => {
                              setSelectedCountry(country);
                              setShowCountryPicker(false);
                              setSearchQuery('');
                            }}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs hover:bg-primary/10 transition-colors",
                              selectedCountry.code === country.code && "bg-primary/5 text-primary"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <span>{country.flag}</span>
                              <span className="font-bold">{country.name}</span>
                            </div>
                            {selectedCountry.code === country.code && <Check className="h-3 w-3" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-widest text-foreground/60 px-1">
                  Base City
                </label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted/30" />
                  <Input
                    placeholder="e.g. Nairobi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="h-12 pl-11 bg-surface/50 border-border/50 focus:border-primary/30 transition-all rounded-xl text-sm"
                  />
                </div>
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
                {profile.onboarding_role === 'entrepreneur' ? 'Venture Mission' : 'Scout Mission Statement'}
              </label>
              <textarea
                rows={4}
                placeholder={profile.onboarding_role === 'entrepreneur' 
                  ? "Describe your entrepreneurial goals, target industries, and the kind of funding or partnerships you are hunting for..."
                  : "Describe your career goals, target roles, and the specific industries you are scouting for..."
                }
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
