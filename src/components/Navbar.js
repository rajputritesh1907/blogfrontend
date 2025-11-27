'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, User, LogOut, PenTool, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
    const { user, logout, loading } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                scrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex-shrink-0 flex items-center group">
                            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent group-hover:to-primary transition-all">
                                blog19
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <ThemeToggle />
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                            </div>
                        ) : user ? (
                            <>
                                <Link href="/create">
                                    <Button variant="ghost" className="rounded-full">
                                        <PenTool className="w-4 h-4 mr-2" />
                                        Write
                                    </Button>
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 focus:outline-none">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt={user.name} width={32} height={32} className="w-8 h-8 rounded-full ring-2 ring-transparent group-hover:ring-primary transition-all" />
                                        ) : (
                                            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center ring-2 ring-transparent group-hover:ring-primary transition-all">
                                                <User className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                        )}
                                    </button>
                                    <div className="absolute right-0 w-56 mt-2 py-2 bg-popover rounded-xl shadow-xl border border-border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right translate-y-2 group-hover:translate-y-0">
                                        <div className="px-4 py-3 border-b border-border">
                                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <Link href="/profile">
                                                <Button variant="ghost" className="w-full justify-start text-sm">
                                                    Profile
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={logout}
                                            >
                                                <LogOut className="w-4 h-4 mr-2" />
                                                Sign out
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link href="/login">
                                    <Button variant="ghost">Sign in</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="rounded-full">Get Started</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b relative z-50"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <ThemeToggle
                                mobile={true}
                                onClick={() => setIsMenuOpen(false)}
                            />
                            {loading ? (
                                <div className="flex items-center space-x-3 px-3 py-3 mb-4 bg-muted/50 rounded-lg">
                                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="w-20 h-4 bg-muted rounded animate-pulse" />
                                        <div className="w-16 h-3 bg-muted rounded animate-pulse" />
                                    </div>
                                </div>
                            ) : user ? (
                                <>
                                    <div className="flex items-center space-x-3 px-3 py-3 mb-4 bg-muted/50 rounded-lg">
                                        {user.avatar_url ? (
                                            <Image src={user.avatar_url} alt={user.name} width={40} height={40} className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                <User className="w-6 h-6 text-muted-foreground" />
                                            </div>
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{user.name}</p>
                                            <p className="text-xs text-muted-foreground">{user.email}</p>
                                        </div>
                                    </div>
                                    <Link href="/create" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start h-12">
                                            <PenTool className="w-5 h-5 mr-3" />
                                            Write a Post
                                        </Button>
                                    </Link>
                                    <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start h-12">
                                            Profile
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 h-12"
                                        onClick={() => {
                                            logout();
                                            setIsMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="w-5 h-5 mr-3" />
                                        Sign out
                                    </Button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-2">
                                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start h-12">Sign in</Button>
                                    </Link>
                                    <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full h-12">Get Started</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    );
}
