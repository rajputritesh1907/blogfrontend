'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import {
    User,
    Mail,
    Edit3,
    Save,
    X,
    Settings,
    FileText,
    Calendar,
    ArrowLeft,
    Loader2,
    Camera,
    Trash2,
    Heart,
    MessageCircle,
    Clock,
    Eye
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import Image from 'next/image';

export default function Profile() {
    const { user, logout, updateUser, loading } = useAuth();
    const { success, error: showError } = useToast();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [postsLoading, setPostsLoading] = useState(true);
    const [userPosts, setUserPosts] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        bio: '',
        avatar: null,
        avatarPreview: null
    });

    // Initialize form data when user loads
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar_url || null,
                avatarPreview: user.avatar_url || null
            });
        }
    }, [user]);

    // Fetch user's posts from API
    useEffect(() => {
        const fetchUserPosts = async () => {
            if (user && user._id && !loading) {
                setPostsLoading(true);
                try {
                    const token = localStorage.getItem('token');
                    console.log('Fetching posts for user:', user._id, 'with token present:', !!token);

                    if (!token) {
                        console.error('No auth token found - user needs to login');
                        showError('Please log in to view your posts');
                        setUserPosts([]);
                        setPostsLoading(false);
                        return;
                    }

                    console.log('Making API call to fetch posts...');
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts/user/${user._id}`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    console.log('API Response status:', response.status);

                    if (response.ok) {
                        const posts = await response.json();
                        console.log('Successfully fetched', posts.length, 'posts');
                        setUserPosts(posts);
                    } else if (response.status === 401) {
                        console.error('Authentication failed - token invalid');
                        showError('Your session has expired. Please log in again.');
                        localStorage.removeItem('token');
                        // Optionally redirect to login
                        // router.push('/login');
                        setUserPosts([]);
                    } else {
                        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                        console.error('API Error:', response.status, errorData);
                        showError('Failed to load posts: ' + (errorData.message || 'Unknown error'));
                        setUserPosts([]);
                    }
                } catch (error) {
                    console.error('Network error fetching user posts:', error);
                    if (error.name === 'TypeError' && error.message.includes('fetch')) {
                        showError('Network error. Please check your connection and try again.');
                    } else {
                        showError('Failed to load posts. Please try again.');
                    }
                    setUserPosts([]);
                } finally {
                    setPostsLoading(false);
                }
            } else {
                console.log('Skipping posts fetch - user loading:', loading, 'user present:', !!user);
                setPostsLoading(false);
            }
        };

        // Add a small delay to ensure authentication is complete
        const timeoutId = setTimeout(fetchUserPosts, 100);
        return () => clearTimeout(timeoutId);
    }, [user, loading, showError]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showError('Please select a valid image file');
                return;
            }

            // Validate file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                showError('Image size must be less than 2MB');
                return;
            }

            // Convert to base64 for preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    avatar: file,
                    avatarPreview: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const updateData = {
                name: formData.name,
                bio: formData.bio,
                avatar: formData.avatarPreview // base64 string
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts/profile`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                success('Profile updated successfully!');

                // Update the user context with new data
                updateUser(updatedUser);

                setIsEditing(false);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update profile');
            }
        } catch (err) {
            showError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelEdit = () => {
        // Reset form data to original user data
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                bio: user.bio || '',
                avatar: user.avatar_url || null,
                avatarPreview: user.avatar_url || null
            });
        }
        setIsEditing(false);
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts/${postId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setUserPosts(prev => prev.filter(post => post.id !== postId));
                success('Post deleted successfully!');
            } else {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete post');
            }
        } catch (err) {
            showError(err.message || 'Failed to delete post. Please try again.');
        }
    };

    // Show loading while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-2 text-sm text-muted-foreground">Loading your profile...</p>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (!user) {
        console.log('User not authenticated, redirecting to login');
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
                                    Back to Home
                                </Button>
                            </Link>
                            <h1 className="text-xl font-semibold">Profile</h1>
                        </div>
                        <div className="flex items-center space-x-2">
                            {!isEditing ? (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(true)}
                                >
                                    <Edit3 className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={handleCancelEdit}
                                        disabled={isLoading}
                                    >
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSaveProfile}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <Save className="w-4 h-4 mr-2" />
                                        )}
                                        Save
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Profile Info */}
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="w-5 h-5 mr-2" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">

                                {/* Avatar */}
                                <div className="flex flex-col items-center space-y-4">
                                    <div className="relative">
                                        {formData.avatarPreview ? (
                                            <Image
                                                src={formData.avatarPreview}
                                                alt="Profile avatar"
                                                width={120}
                                                height={120}
                                                className="w-30 h-30 rounded-full object-cover border-4 border-background"
                                            />
                                        ) : (
                                            <div className="w-30 h-30 rounded-full bg-muted flex items-center justify-center border-4 border-background">
                                                <User className="w-12 h-12 text-muted-foreground" />
                                            </div>
                                        )}
                                        {isEditing && (
                                            <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                                                <Camera className="w-4 h-4" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <p className="text-xs text-muted-foreground text-center">
                                            Click the camera icon to change your avatar
                                        </p>
                                    )}
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium">Full Name</label>
                                        {isEditing ? (
                                            <Input
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="mt-1"
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">{user.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium flex items-center">
                                            <Mail className="w-4 h-4 mr-1" />
                                            Email
                                        </label>
                                        <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Email cannot be changed
                                        </p>
                                    </div>

                                    <div>
                                        <label className="text-sm font-medium">Bio</label>
                                        {isEditing ? (
                                            <textarea
                                                name="bio"
                                                value={formData.bio}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="mt-1 w-full p-3 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                                placeholder="Tell us about yourself..."
                                            />
                                        ) : (
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                {user.bio || 'No bio added yet.'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Account Actions */}
                                <div className="pt-4 border-t">
                                    <Button
                                        variant="destructive"
                                        className="w-full"
                                        onClick={() => {
                                            if (confirm('Are you sure you want to sign out?')) {
                                                logout();
                                            }
                                        }}
                                    >
                                        Sign Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Posts */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="w-5 h-5 mr-2" />
                                    Your Blog Posts
                                    <span className="ml-auto text-sm font-normal text-muted-foreground">
                                        {userPosts.length} post{userPosts.length !== 1 ? 's' : ''}
                                    </span>
                                </CardTitle>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Posts published by you • Only visible to you
                                </p>
                            </CardHeader>
                            <CardContent>
                                {postsLoading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((i) => (
                                            <div key={i} className="border rounded-lg p-6 animate-pulse">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <div className="h-6 bg-muted rounded mb-2 w-3/4"></div>
                                                    </div>
                                                </div>
                                                <div className="h-4 bg-muted rounded mb-3 w-full"></div>
                                                <div className="h-4 bg-muted rounded mb-4 w-2/3"></div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-6">
                                                        <div className="h-3 bg-muted rounded w-16"></div>
                                                        <div className="h-3 bg-muted rounded w-12"></div>
                                                        <div className="h-3 bg-muted rounded w-8"></div>
                                                        <div className="h-3 bg-muted rounded w-10"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userPosts.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-primary">{userPosts.length}</div>
                                                <div className="text-xs text-muted-foreground">Total Posts</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-green-600">
                                                    {userPosts.reduce((sum, post) => sum + post.likes, 0)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Total Likes</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-blue-600">
                                                    {userPosts.reduce((sum, post) => sum + post.comments, 0)}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Total Comments</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-purple-600">
                                                    {Math.round(userPosts.reduce((sum, post) => sum + post.readTime, 0) / userPosts.length) || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">Avg. Read Time</div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {userPosts.map((post) => (
                                                <motion.div
                                                    key={post.id}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="border rounded-lg p-6 hover:bg-muted/50 transition-colors"
                                                >
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-start justify-between mb-3">
                                                                <h3 className="font-semibold text-lg leading-tight hover:text-primary cursor-pointer transition-colors">
                                                                    {post.title}
                                                                </h3>
                                                            </div>

                                                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                                                {post.content}
                                                            </p>

                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center space-x-6 text-xs text-muted-foreground">
                                                                    <div className="flex items-center">
                                                                        <Calendar className="w-3 h-3 mr-1" />
                                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Clock className="w-3 h-3 mr-1" />
                                                                        {post.readTime} min read
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <Heart className="w-3 h-3 mr-1" />
                                                                        {post.likes}
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        <MessageCircle className="w-3 h-3 mr-1" />
                                                                        {post.comments}
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center space-x-2">
                                                                    {post.tags.slice(0, 2).map((tag) => (
                                                                        <span
                                                                            key={tag}
                                                                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
                                                                        >
                                                                            {tag}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center space-x-2 ml-4">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-muted-foreground hover:text-foreground"
                                                                title="View post"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() => handleDeletePost(post.id)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                title="Delete post"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}

                                            <div className="pt-4 border-t text-center">
                                                <Link href="/create">
                                                    <Button variant="outline">
                                                        <Edit3 className="w-4 h-4 mr-2" />
                                                        Write New Post
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                        <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                                        <p className="text-muted-foreground mb-4">
                                            Start writing your first blog post!
                                        </p>
                                        <Link href="/create">
                                            <Button>
                                                <Edit3 className="w-4 h-4 mr-2" />
                                                Create Your First Post
                                            </Button>
                                        </Link>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
