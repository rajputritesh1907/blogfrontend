'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Mail, Lock, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, user, loading } = useAuth();
    const router = useRouter();

    // Redirect authenticated users to profile
    useEffect(() => {
        if (!loading && user) {
            router.push('/profile');
        }
    }, [user, loading, router]);

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                </div>
            </div>
        );
    }

    // Don't render anything if user is authenticated (will redirect)
    if (user) {
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        const res = await login(email, password);
        if (!res.success) {
            setError(res.message);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left Side - Form */}
            <div className="flex items-center justify-center p-8 md:p-12 lg:p-16 bg-background">
                <div className="w-full max-w-md space-y-8">
                    <div className="space-y-2">
                        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to home
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight font-serif">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to access your account</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 text-sm text-destructive bg-destructive/10 rounded-lg border border-destructive/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none" htmlFor="password">
                                    Password
                                </label>
                                <Link href="#" className="text-sm font-medium text-primary hover:underline">
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-10"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <Button className="w-full h-12 text-base" type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="font-medium text-primary hover:underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Right Side - Visual */}
            <div className="hidden lg:flex relative bg-zinc-900 text-white items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-indigo-600/20" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay" />

                <div className="relative z-10 max-w-lg text-center p-12 space-y-6">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold font-serif">&ldquo;The best way to predict the future is to create it.&rdquo;</h2>
                    <p className="text-lg text-white/60">- Peter Drucker</p>
                </div>
            </div>
        </div>
    );
}
