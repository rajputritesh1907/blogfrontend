'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, Heart, MessageCircle, User, ArrowRight, FileText } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import ArticleSkeleton from '../../components/ArticleSkeleton';

import api from '../../lib/api';

export default function AllBlogs() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPosts, setFilteredPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // Fallback to trending posts since /api/posts (get all) seems to be missing on the backend
                const response = await api.get('/posts/trending');

                if (response.status === 200) {
                    setPosts(response.data);
                    setFilteredPosts(response.data);
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredPosts(posts);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = posts.filter(post =>
                post.title.toLowerCase().includes(query) ||
                post.content.toLowerCase().includes(query) ||
                post.author?.name?.toLowerCase().includes(query) ||
                post.tags?.some(tag => tag.toLowerCase().includes(query))
            );
            setFilteredPosts(filtered);
        }
    }, [searchQuery, posts]);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-background pb-12 md:pb-20">


            {/* Content Section */}
            <div className="max-w-6xl mx-auto px-4 pt-8 md:pt-12">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        <ArticleSkeleton count={6} />
                    </div>
                ) : (
                    <>


                        {filteredPosts.length > 0 ? (
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate="show"
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
                            >
                                {filteredPosts.map((post) => (
                                    <motion.div key={post.id || post._id} variants={item}>
                                        <Card
                                            className="group h-full flex flex-col border-0 bg-transparent shadow-none hover:bg-card/50 transition-all duration-300 rounded-2xl overflow-hidden"
                                        >
                                            <Link href={`/blog/${post.id || post._id}`} className="block relative aspect-[16/10] overflow-hidden rounded-2xl mb-4">
                                                {post.coverImage ? (
                                                    <Image
                                                        src={post.coverImage}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-muted flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                                        <FileText className="w-12 h-12 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </Link>

                                            <div className="flex flex-col flex-1 px-2">
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                                                    <span className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span>•</span>
                                                    <span className="flex items-center">
                                                        <Clock className="w-3 h-3 mr-1" />
                                                        {post.readTime || Math.ceil((post.content?.length || 0) / 1000)} min read
                                                    </span>
                                                </div>

                                                <Link href={`/blog/${post.id || post._id}`} className="group-hover:text-primary transition-colors">
                                                    <h3 className="text-xl font-bold font-serif mb-2 line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                </Link>

                                                <div className="text-muted-foreground text-sm mb-4 flex-1 prose prose-sm max-w-none dark:prose-invert">
                                                    {post.content}
                                                </div>

                                                <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
                                                    <div className="flex items-center gap-2">
                                                        {post.author?.avatar_url ? (
                                                            <Image
                                                                src={post.author.avatar_url}
                                                                alt={post.author.name}
                                                                width={24}
                                                                height={24}
                                                                className="rounded-full"
                                                            />
                                                        ) : (
                                                            <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                                                                <User className="w-3 h-3 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                        <span className="text-sm font-medium truncate max-w-[100px]">
                                                            {post.author?.name || 'Anonymous'}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Heart className="w-3 h-3" />
                                                            <span>{post.likes || 0}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <MessageCircle className="w-3 h-3" />
                                                            <span>{post.comments || 0}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            null
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
