'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Save, Eye, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import ImageUpload from '../../components/ImageUpload';
import Image from 'next/image';

export default function CreatePost() {
    const { user, loading } = useAuth();
    const { success, error: showError } = useToast();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState('');
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isPreview, setIsPreview] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) {
            showError('Please fill in both title and content');
            return;
        }

        setIsLoading(true);
        try {
            // Prepare post data
            const postData = {
                title: title.trim(),
                content: content.trim(),
                tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
                excerpt: content.substring(0, 200) + (content.length > 200 ? '...' : ''),
                coverImage: images.length > 0 ? images[0].base64 : null
            };

            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            if (response.ok) {
                const result = await response.json();
                success(`Post "${result.title}" created successfully!`);
                router.push('/profile');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to create post');
            }
        } catch (err) {
            showError(err.message || 'Failed to create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) {
        router.push('/login');
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Link href="/">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Back
                                </Button>
                            </Link>
                            <h1 className="text-xl font-semibold">Create New Post</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setIsPreview(!isPreview)}
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                {isPreview ? 'Edit' : 'Preview'}
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                size="sm"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Publish
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {isPreview ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        {/* Preview Header */}
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight">{title || 'Untitled Post'}</h1>
                            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                <div className="flex items-center space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-muted" />
                                    <span>{user?.name || 'Anonymous'}</span>
                                </div>
                                <span>•</span>
                                <span>Just now</span>
                                {tags && (
                                    <>
                                        <span>•</span>
                                        <span>{tags}</span>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Preview Images */}
                        {images.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold">Images</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {images.map((image) => (
                                        <div key={image.id} className="relative">
                                            <Image
                                                src={image.base64}
                                                alt={image.name}
                                                width={400}
                                                height={300}
                                                className="w-full h-48 object-cover rounded-lg"
                                            />
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <p className="text-xs text-white bg-black/50 rounded px-2 py-1 truncate">
                                                    {image.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Preview Content */}
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap leading-relaxed">
                                {content || 'No content yet...'}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.form
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Title */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Post title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 shadow-none"
                                style={{ fontSize: '2rem', lineHeight: '1.2' }}
                            />
                        </div>

                        {/* Tags */}
                        <div className="space-y-2">
                            <Input
                                placeholder="Tags (comma separated)..."
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                className="border-0 px-0 focus-visible:ring-0 shadow-none text-muted-foreground"
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center">
                                <ImageIcon className="w-4 h-4 mr-2" />
                                Images ({images.length}/10)
                            </label>
                            <ImageUpload
                                images={images}
                                onImagesChange={setImages}
                                maxImages={10}
                            />
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                            <textarea
                                placeholder="Write your story..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full min-h-[400px] p-4 text-base leading-relaxed border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                style={{ lineHeight: '1.6' }}
                            />
                        </div>
                    </motion.form>
                )}
            </div>
        </div>
    );
}
