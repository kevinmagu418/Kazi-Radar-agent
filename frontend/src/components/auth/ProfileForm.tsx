import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function ProfileForm({ initialProfile }: { initialProfile: Record<string, string> }) {
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const supabase = createClient();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: profile.full_name,
        bio: profile.bio,
        location: profile.location,
      })
      .eq('id', profile.id);

    if (error) {
      alert('Error updating profile: ' + error.message);
    } else {
      alert('Profile updated successfully!');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-semibold">Full Name</label>
        <Input
          value={profile.full_name || ''}
          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Bio</label>
        <Input
          value={profile.bio || ''}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold">Location</label>
        <Input
          value={profile.location || ''}
          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
