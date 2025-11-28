'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useToast } from '../../../context/ToastContext';
import Link from 'next/link';
import { Button } from '../../../components/ui/Button';
import { Card, CardContent } from '../../../components/ui/Card';
import {
    ArrowLeft,
    Calendar,
    Clock,
    Heart,
    MessageCircle,
    Eye,
    User,
    Loader2,
    Share2,
    Send,
    Reply,
    Trash2
} from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function BlogPost() {
    const { id } = useParams();
    const router = useRouter();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [commentsLoading, setCommentsLoading] = useState(true);
    const { user } = useAuth();
    const { success, error: showError } = useToast();

    const fetchComments = useCallback(async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/comments/post/${id}`);
            if (response.ok) {
                const commentsData = await response.json();
                setComments(commentsData);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setCommentsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts/${id}`);

                if (response.ok) {
                    const postData = await response.json();
                    setPost(postData);
                    setLikesCount(postData.likes);
                    setLiked(postData.userHasLiked || false);
                } else if (response.status === 404) {
                    setError('Post not found');
                } else {
                    setError('Failed to load post');
                }
            } catch (err) {
                console.error('Error fetching post:', err);
                setError('Network error. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, user]);

    const handleLike = async () => {
        if (!post || !user) {
            showError('Please log in to like posts');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/posts/${id}/like`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLiked(data.liked);
                setLikesCount(data.likesCount);
                success(data.message);
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Failed to update like');
            }
        } catch (error) {
            console.error('Error liking post:', error);
            showError('Failed to update like. Please try again.');
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
        }
    };

    // Load comments when post loads
    useEffect(() => {
        if (post) {
            fetchComments();
        }
    }, [post, fetchComments]);

    const handleAddComment = async () => {
        if (!user) {
            showError('Please log in to comment');
            return;
        }

        if (!newComment.trim()) {
            showError('Comment cannot be empty');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/comments/post/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment.trim() })
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments(prev => [...prev, newCommentData]);
                setNewComment('');
                success('Comment added successfully!');
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Failed to add comment');
            }
        } catch (error) {
            console.error('Error adding comment:', error);
            showError('Failed to add comment. Please try again.');
        }
    };

    const handleAddReply = async (parentId) => {
        if (!user) {
            showError('Please log in to reply');
            return;
        }

        if (!replyText.trim()) {
            showError('Reply cannot be empty');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/comments/post/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    content: replyText.trim(),
                    parentId
                })
            });

            if (response.ok) {
                const newReply = await response.json();
                // Add reply to the parent comment
                setComments(prev => prev.map(comment =>
                    comment._id === parentId
                        ? { ...comment, replies: [...(comment.replies || []), newReply] }
                        : comment
                ));
                setReplyTo(null);
                setReplyText('');
                success('Reply added successfully!');
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Failed to add reply');
            }
        } catch (error) {
            console.error('Error adding reply:', error);
            showError('Failed to add reply. Please try again.');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'}/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                setComments(prev => prev.filter(comment => comment._id !== commentId));
                success('Comment deleted successfully!');
            } else {
                const errorData = await response.json();
                showError(errorData.message || 'Failed to delete comment');
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            showError('Failed to delete comment. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading post...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="text-center p-8">
                        <h1 className="text-2xl font-bold mb-4">Oops!</h1>
                        <p className="text-muted-foreground mb-6">{error}</p>
                        <Button onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="max-w-md">
                    <CardContent className="text-center p-8">
                        <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
                        <p className="text-muted-foreground mb-6">The post you&apos;re looking for doesn&apos;t exist.</p>
                        <Link href="/">
                            <Button>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Button variant="ghost" onClick={() => router.back()}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" />
                                Share
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Article */}
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Cover Image */}
                {post.coverImage && (
                    <div className="mb-8">
                        <Image
                            src={post.coverImage}
                            alt={post.title}
                            width={800}
                            height={400}
                            className="w-full h-64 md:h-96 object-cover rounded-lg"
                            priority
                        />
                    </div>
                )}

                {/* Title */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 font-serif leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta Information */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-6">
                        <div className="flex items-center">
                            {post.author.avatar_url ? (
                                <Image
                                    src={post.author.avatar_url}
                                    alt={post.author.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full mr-3"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-muted mr-3 flex items-center justify-center">
                                    <User className="w-5 h-5" />
                                </div>
                            )}
                            <div>
                                <p className="font-medium text-foreground">{post.author.name}</p>
                                <p className="text-xs">Author</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </div>

                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {Math.ceil(post.content.length / 200)} min read
                        </div>

                        <div className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {post.views} views
                        </div>
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p className="text-xl text-muted-foreground leading-relaxed mb-8">
                            {post.excerpt}
                        </p>
                    )}
                </motion.header>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-lg max-w-none dark:prose-invert"
                >
                    <div
                        className="leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />
                </motion.div>

                {/* Engagement */}
                <motion.footer
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-12 pt-8 border-t"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant={liked ? "default" : "outline"}
                                size="sm"
                                onClick={handleLike}
                                className="flex items-center space-x-2"
                            >
                                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                                <span>{likesCount}</span>
                            </Button>

                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                <MessageCircle className="w-4 h-4" />
                                <span>{post.comments || 0} comments</span>
                            </div>
                        </div>

                        <Button variant="outline" size="sm" onClick={handleShare}>
                            <Share2 className="w-4 h-4 mr-2" />
                            Share Article
                        </Button>
                    </div>
                </motion.footer>

                {/* Author Bio */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="mt-12 p-6 bg-muted/30 rounded-lg"
                >
                    <div className="flex items-start space-x-4">
                        {post.author.avatar_url ? (
                            <Image
                                src={post.author.avatar_url}
                                alt={post.author.name}
                                width={60}
                                height={60}
                                className="w-15 h-15 rounded-full"
                            />
                        ) : (
                            <div className="w-15 h-15 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-7 h-7" />
                            </div>
                        )}
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg mb-1">{post.author.name}</h3>
                            {post.author.bio && (
                                <p className="text-muted-foreground">{post.author.bio}</p>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Comments Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-16 pt-8 border-t"
                >
                    <div className="flex items-center mb-6">
                        <MessageCircle className="w-6 h-6 mr-2" />
                        <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
                    </div>

                    {/* Add Comment */}
                    {user ? (
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <div className="flex items-start space-x-4">
                                    {user.avatar_url ? (
                                        <Image
                                            src={user.avatar_url}
                                            alt={user.name}
                                            width={40}
                                            height={40}
                                            className="w-10 h-10 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            <User className="w-5 h-5" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Share your thoughts..."
                                            className="w-full p-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                                            rows={3}
                                        />
                                        <div className="flex justify-end mt-3">
                                            <Button
                                                onClick={handleAddComment}
                                                disabled={!newComment.trim()}
                                                className="flex items-center"
                                            >
                                                <Send className="w-4 h-4 mr-2" />
                                                Comment
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card className="mb-8">
                            <CardContent className="p-6 text-center">
                                <p className="text-muted-foreground mb-4">
                                    Please <Link href="/login" className="text-primary hover:underline">log in</Link> to join the conversation.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Comments List */}
                    {commentsLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <Card key={i} className="animate-pulse">
                                    <CardContent className="p-6">
                                        <div className="flex items-start space-x-4">
                                            <div className="w-10 h-10 rounded-full bg-muted"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-muted rounded w-1/4"></div>
                                                <div className="h-4 bg-muted rounded w-3/4"></div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-6">
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    onReply={setReplyTo}
                                    onDelete={handleDeleteComment}
                                    replyTo={replyTo}
                                    replyText={replyText}
                                    setReplyText={setReplyText}
                                    onSubmitReply={handleAddReply}
                                    currentUser={user}
                                />
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="p-8 text-center">
                                <MessageCircle className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                                <h4 className="text-lg font-medium mb-2">No comments yet</h4>
                                <p className="text-muted-foreground">
                                    Be the first to share your thoughts on this post!
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </motion.div>
            </article>
        </div>
    );
}

// Comment Item Component
function CommentItem({ comment, onReply, onDelete, replyTo, replyText, setReplyText, onSubmitReply, currentUser }) {
    const canDelete = currentUser && comment.user._id === currentUser._id;

    return (
        <div className="space-y-4">
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                        {comment.user.avatar_url ? (
                            <Image
                                src={comment.user.avatar_url}
                                alt={comment.user.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                <User className="w-5 h-5" />
                            </div>
                        )}
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2">
                                    <span className="font-semibold">{comment.user.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                {canDelete && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onDelete(comment._id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                )}
                            </div>
                            <p className="text-muted-foreground mb-3">{comment.content}</p>
                            {currentUser && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onReply(replyTo === comment._id ? null : comment._id)}
                                    className="text-muted-foreground hover:text-foreground"
                                >
                                    <Reply className="w-4 h-4 mr-1" />
                                    Reply
                                </Button>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Reply Form */}
            {replyTo === comment._id && currentUser && (
                <Card className="ml-8">
                    <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                            {currentUser.avatar_url ? (
                                <Image
                                    src={currentUser.avatar_url}
                                    alt={currentUser.name}
                                    width={32}
                                    height={32}
                                    className="w-8 h-8 rounded-full"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <User className="w-4 h-4" />
                                </div>
                            )}
                            <div className="flex-1">
                                <textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder={`Reply to ${comment.user.name}...`}
                                    className="w-full p-3 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none text-sm"
                                    rows={2}
                                />
                                <div className="flex justify-end mt-2 space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            setReplyText('');
                                            onReply(null);
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => onSubmitReply(comment._id)}
                                        disabled={!replyText.trim()}
                                    >
                                        <Send className="w-4 h-4 mr-1" />
                                        Reply
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-8 space-y-4">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply._id}
                            comment={reply}
                            onReply={onReply}
                            onDelete={onDelete}
                            replyTo={replyTo}
                            replyText={replyText}
                            setReplyText={setReplyText}
                            onSubmitReply={onSubmitReply}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
