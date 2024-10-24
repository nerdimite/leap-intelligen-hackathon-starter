import { useState, useEffect } from 'react';
import { User } from '@/types/user';

function generateProfileImageUrl(user: User | null): string {
  const seed = user ? `${user.first_name} ${user.last_name}` : 'Greenbase User';
  return `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(seed)}`;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState<string>('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setProfileImageUrl(generateProfileImageUrl(data.user));
        } else {
          setError('Failed to fetch user data');
        }
      } catch (error) {
        setError('Error fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading, error, profileImageUrl };
}
