'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!auth) return;
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && user.email?.endsWith('@esrent.ae')) {
        router.push('/admin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!auth) {
        setError('Authentication not initialized');
        return;
      }
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.email?.endsWith('@esrent.ae')) {
        await auth.signOut();
        setError('Unauthorized access');
        return;
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(
        error.code === 'auth/invalid-credential' 
          ? 'Invalid email or password' 
          : error.message || 'Failed to login'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-10 rounded-2xl shadow-lg w-full max-w-md border border-border">
        <h1 className="text-2xl font-medium mb-8 text-center text-card-foreground">Admin Login</h1>
        
        {error && (
          <div className="bg-destructive/10 text-destructive p-4 rounded-xl mb-6 text-sm flex items-center gap-2 border border-destructive/20">
            <span className="text-destructive">⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@esrent.ae"
              required
              disabled={loading}
              className="rounded-lg"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="rounded-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-11 font-medium transition-colors"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
