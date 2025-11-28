'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Clock, Heart, FileText, Users, BookOpen, Star, Zap, PenTool, Feather, Lightbulb, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import ArticleSkeleton from '../components/ArticleSkeleton';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import api from '../lib/api';

// Client-only particle component to avoid hydration mismatches
const ParticleSystem = dynamic(() => import('../components/ParticleSystem'), {
  ssr: false,
  loading: () => null
});

export default function Home() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  // Fetch featured posts
  useEffect(() => {
    const fetchFeaturedPosts = async () => {
      try {
        setFeaturedLoading(true);
        const response = await api.get('/posts/featured?limit=3');

        if (response.status === 200) {
          setFeaturedPosts(response.data);
        } else {
          console.error('Failed to fetch featured posts');
          setFeaturedPosts([]);
        }
      } catch (error) {
        console.error('Error fetching featured posts:', error);
        setFeaturedPosts([]);
      } finally {
        setFeaturedLoading(false);
      }
    };

    fetchFeaturedPosts();
  }, []);

  // Fetch trending posts
  useEffect(() => {
    const fetchTrendingPosts = async () => {
      try {
        setTrendingLoading(true);
        const response = await api.get('/posts/trending?limit=4');

        if (response.status === 200) {
          setTrendingPosts(response.data);
        } else {
          console.error('Failed to fetch trending posts');
          // Fallback to empty array
          setTrendingPosts([]);
        }
      } catch (error) {
        console.error('Error fetching trending posts:', error);
        setTrendingPosts([]);
      } finally {
        setTrendingLoading(false);
      }
    };

    fetchTrendingPosts();
  }, []);

  useEffect(() => {
    // Simulate loading time for demo purposes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
    <div className="space-y-12 md:space-y-16 lg:space-y-20 pb-12 md:pb-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        {/* Creative Background */}
        <div className="absolute inset-0 -z-10">
          {/* Dynamic gradient orbs */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[300px] bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[250px] bg-gradient-to-l from-accent/15 via-primary/8 to-secondary/15 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-radial from-primary/5 via-transparent to-secondary/5 rounded-full blur-3xl opacity-40" />

          {/* Creative floating shapes */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Large floating triangles */}
            <motion.div
              className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/20 rotate-45"
              animate={{
                y: [0, -30, 0],
                rotate: [45, 135, 45],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-40 right-20 w-16 h-16 border-2 border-secondary/20 rotate-12"
              animate={{
                y: [0, 40, 0],
                rotate: [12, 72, 12],
                scale: [1, 0.9, 1]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />

            {/* Floating circles */}
            <motion.div
              className="absolute bottom-32 left-1/4 w-12 h-12 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 blur-sm"
              animate={{
                x: [0, 50, 0],
                y: [0, -20, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div
              className="absolute top-1/3 right-1/3 w-8 h-8 rounded-full bg-gradient-to-r from-accent/30 to-primary/20 blur-sm"
              animate={{
                x: [0, -40, 0],
                y: [0, 30, 0],
                scale: [1, 0.8, 1]
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            />

            {/* Geometric patterns */}
            <motion.div
              className="absolute top-16 right-10 w-6 h-6 border border-primary/30"
              animate={{
                rotate: [0, 180, 360],
                scale: [1, 1.3, 1]
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Client-only particle system */}
            <ParticleSystem />
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center space-y-6 md:space-y-8"
          >
            {/* Creative Headline */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4 md:space-y-6"
            >
              <div className="relative">
                <motion.h1
                  className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight font-serif leading-tight relative z-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  <motion.span
                    className="block text-4xl sm:text-5xl md:text-7xl lg:text-9xl xl:text-[10rem] font-black tracking-wider text-black animate-pulse leading-none"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.2, type: "spring", stiffness: 80 }}
                  >
                    BLOG19
                  </motion.span>
                  <motion.span
                    className="block text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-black"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                  >
                    Where ideas take
                  </motion.span>
                  <motion.span
                    className="block relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.0 }}
                  >
                    <span className="text-black">
                      flight
                    </span>
                    {/* Creative underline */}
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 1, delay: 1, ease: "easeOut" }}
                    />
                  </motion.span>
                </motion.h1>

                {/* Floating creative icons */}
                <motion.div
                  className="absolute -top-6 md:-top-8 -left-6 md:-left-8 text-primary/20"
                  animate={{
                    y: [0, -10, 0],
                    rotate: [0, 10, 0]
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <Lightbulb className="w-6 h-6 md:w-8 md:h-8" />
                </motion.div>
                <motion.div
                  className="absolute -top-3 md:-top-4 -right-8 md:-right-12 text-secondary/20"
                  animate={{
                    y: [0, 15, 0],
                    rotate: [0, -15, 0]
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  <Feather className="w-5 h-5 md:w-7 md:h-7" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 md:-bottom-6 left-1/4 text-accent/20"
                  animate={{
                    y: [0, -8, 0],
                    rotate: [0, 20, 0]
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5
                  }}
                >
                  <PenTool className="w-4 h-4 md:w-6 md:h-6" />
                </motion.div>
              </div>
            </motion.div>

            {/* Creative Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <motion.p
                className="text-base md:text-lg lg:text-xl text-muted-foreground leading-relaxed mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Transform your thoughts into
                <motion.span
                  className="font-semibold text-black"
                >
                  {" compelling stories"}
                </motion.span>
                . Connect with readers worldwide, build your audience, and turn your passion for writing into something {" "}
                <motion.span
                  className="font-semibold text-foreground"
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                >
                  extraordinary
                </motion.span>
                .
              </motion.p>

              {/* Creative highlight bar */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <div className="w-24 h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-full" />
              </motion.div>
            </motion.div>

            {/* Creative Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-12 py-6 md:py-8"
            >
              {[
                { icon: Users, value: "10K+", label: "Writers", color: "text-blue-500", delay: 0 },
                { icon: BookOpen, value: "50K+", label: "Articles", color: "text-green-500", delay: 0.1 },
                { icon: Heart, value: "200K+", label: "Likes", color: "text-red-500", delay: 0.2 },
                { icon: Star, value: "4.9/5", label: "Rating", color: "text-yellow-500", delay: 0.3 }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  className="group relative"
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.6 + stat.delay,
                    ease: "easeOut"
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="relative flex flex-col items-center gap-2 bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-3 md:p-4 min-w-[90px] md:min-w-[100px] hover:border-primary/30 transition-colors">
                    <motion.div
                      className={`${stat.color} group-hover:scale-110 transition-transform`}
                      animate={{
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.5
                      }}
                    >
                      <stat.icon className="h-5 w-5 md:h-6 md:w-6" />
                    </motion.div>
                    <motion.span
                      className="text-lg md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        duration: 0.5,
                        delay: 0.8 + stat.delay,
                        type: "spring",
                        stiffness: 200
                      }}
                    >
                      {stat.value}
                    </motion.span>
                    <span className="text-xs md:text-sm text-muted-foreground font-medium">{stat.label}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Creative CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex flex-col sm:flex-row justify-center gap-4 md:gap-6 pt-4 md:pt-6"
            >
              {user ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                    <Link href="/create">
                      <Button size="lg" className="relative rounded-full px-6 md:px-8 text-sm md:text-base h-12 md:h-14 w-full sm:w-auto shadow-xl md:shadow-2xl hover:shadow-primary/25 transition-all duration-300 bg-gradient-to-r from-primary via-primary to-secondary hover:from-primary/90 hover:via-primary/95 hover:to-secondary/90 border-2 border-transparent hover:border-primary/30">
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <Sparkles className="w-5 h-5 animate-pulse" />
                          <span className="font-semibold">Write Your Story</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-6 md:px-8 text-sm md:text-base h-12 md:h-14 w-full sm:w-auto border-2 border-border hover:border-primary/60 hover:bg-primary/5 transition-all duration-300 shadow-lg hover:shadow-xl"
                      onClick={() => {
                        document.getElementById('featured-stories-heading')?.scrollIntoView({
                          behavior: 'smooth'
                        });
                      }}
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <TrendingUp className="w-5 h-5" />
                        <span className="font-semibold">Discover Stories</span>
                      </motion.div>
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    {/* Button glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300" />

                    <Link href="/register">
                      <Button size="lg" className="relative rounded-full px-8 text-base h-14 w-full sm:w-auto shadow-2xl hover:shadow-primary/25 transition-all duration-300 bg-gradient-to-r from-primary via-secondary to-accent hover:from-primary/90 hover:via-secondary/95 hover:to-accent/90 border-2 border-transparent hover:border-primary/30">
                        <motion.div
                          className="flex items-center gap-2"
                          whileHover={{ x: 2 }}
                          transition={{ type: "spring", stiffness: 400 }}
                        >
                          <BookOpen className="w-5 h-5" />
                          <span className="font-semibold">Start Reading Free</span>
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.div>
                      </Button>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="outline"
                      size="lg"
                      className="rounded-full px-8 text-base h-14 w-auto border-2 border-border hover:border-secondary/60 hover:bg-secondary/5 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <motion.div
                        className="flex items-center gap-2"
                        whileHover={{ x: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <FileText className="w-5 h-5" />
                        <span className="font-semibold">Become a Writer</span>
                      </motion.div>
                    </Button>
                  </motion.div>
                </>
              )}
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.8 }}
              className="pt-8 border-t border-border/50 max-w-md mx-auto"
            >
              <p className="text-xs text-muted-foreground mb-4">Trusted by writers from</p>
              <div className="flex justify-center items-center gap-6 opacity-60">
                <div className="text-xs font-medium text-muted-foreground">TechCrunch</div>
                <div className="text-xs font-medium text-muted-foreground">Product Hunt</div>
                <div className="text-xs font-medium text-muted-foreground">Medium</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="space-y-6 md:space-y-8 lg:space-y-10" aria-labelledby="featured-stories-heading">
        <div className="flex items-center justify-between">
          <h2 id="featured-stories-heading" className="text-3xl font-bold tracking-tight font-serif">Featured Stories</h2>
          <Button variant="ghost" size="sm" className="text-sm sm:text-base" aria-label="View all featured stories">View all</Button>
        </div>

        {featuredLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ArticleSkeleton count={3} />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8"
          >
            {featuredPosts.length > 0 ? featuredPosts.map((post, index) => (
              <motion.div key={post.id} variants={item}>
                <Card
                  className="group cursor-pointer border-0 bg-transparent shadow-none hover:bg-card/50 transition-colors p-0 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-2xl"
                  role="button"
                  tabIndex={0}
                  aria-label={`Read article: ${post.title} by ${post.author}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Handle navigation here
                    }
                  }}
                  onClick={() => {
                    // Navigate to full post
                    window.location.href = `/blog/${post.id}`;
                  }}
                >
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={400}
                        height={250}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <FileText className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
                        Featured
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 px-2">
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <span className="flex items-center" aria-label={`${post.readTime} minute read`}>
                        <Clock className="w-3 h-3 mr-1" aria-hidden="true" /> {post.readTime} min read
                      </span>
                      <span aria-hidden="true">•</span>
                      <time dateTime={new Date(post.createdAt).toISOString().split('T')[0]} aria-label={`Published ${new Date(post.createdAt).toLocaleDateString()}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                    </div>
                    <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 font-serif">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                      {post.content}
                    </p>
                    <div className="flex items-center space-x-2 pt-2">
                      {post.authorAvatar ? (
                        <Image
                          src={post.authorAvatar}
                          alt={post.author}
                          width={24}
                          height={24}
                          className="w-6 h-6 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-muted" aria-hidden="true" />
                      )}
                      <span className="text-sm font-medium">{post.author}</span>
                      <div className="flex items-center space-x-1 ml-auto text-xs text-muted-foreground">
                        <Heart className="w-3 h-3" />
                        <span>{post.likes}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8">
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No featured stories yet</h3>
                <p className="text-muted-foreground">Check back soon for new content!</p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* Trending Posts */}
      <section className="space-y-6 md:space-y-8 lg:space-y-10" aria-labelledby="trending-stories-heading">
        <div className="flex items-center justify-between">
          <h2 id="trending-stories-heading" className="text-3xl font-bold tracking-tight font-serif">Trending Now</h2>
          <Button variant="ghost" size="sm" className="text-sm sm:text-base" aria-label="View all trending stories">View all</Button>
        </div>

        {trendingLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ArticleSkeleton count={4} />
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
          >
            {trendingPosts.length > 0 ? trendingPosts.map((post, index) => (
              <motion.div key={post.id} variants={item}>
                <Card
                  className="group cursor-pointer border-0 bg-transparent shadow-none hover:bg-card/50 transition-colors p-0 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-xl"
                  role="button"
                  tabIndex={0}
                  aria-label={`Read article: ${post.title} by ${post.author}`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      // Handle navigation here
                    }
                  }}
                  onClick={() => {
                    // Navigate to full post
                    window.location.href = `/blog/${post.id}`;
                  }}
                >
                  <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 relative">
                    {post.coverImage ? (
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        width={300}
                        height={225}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                        <FileText className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2 text-sm">
                      {post.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      <time dateTime={new Date(post.createdAt).toISOString().split('T')[0]} aria-label={`Published ${new Date(post.createdAt).toLocaleDateString()}`}>
                        {new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </time>
                      {post.likes > 0 && (
                        <>
                          {' • '}
                          <span aria-label={`${post.likes} likes`}>{post.likes} likes</span>
                        </>
                      )}
                    </p>
                  </div>
                </Card>
              </motion.div>
            )) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">No trending posts available yet.</p>
              </div>
            )}
          </motion.div>
        )}
      </section>

      {/* Features Section */}
      <section className="py-12 md:py-16 lg:py-20">
        <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-12 lg:mb-16">
          <motion.h2
            className="text-3xl md:text-4xl font-bold tracking-tight font-serif"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Why Choose blog19?
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Everything you need to share your stories and connect with readers worldwide.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              icon: PenTool,
              title: "Write Freely",
              description: "Beautiful, distraction-free writing experience with rich text editing and real-time saving."
            },
            {
              icon: Users,
              title: "Build Community",
              description: "Connect with like-minded writers and readers. Share ideas, get feedback, and grow together."
            },
            {
              icon: TrendingUp,
              title: "Reach Millions",
              description: "Get discovered by our smart algorithm that surfaces the best content to the right audience."
            },
            {
              icon: Target,
              title: "SEO Optimized",
              description: "Automatic optimization to help your stories reach a wider audience on search engines."
            },
            {
              icon: Heart,
              title: "Reader Engagement",
              description: "Interactive comments, likes, and sharing features to keep your audience engaged."
            },
            {
              icon: BookOpen,
              title: "Learn & Grow",
              description: "Access to writing tips, analytics, and tools to help you become a better writer."
            }
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <Card className="h-full border-0 bg-card/50 hover:bg-card transition-colors p-6 hover:shadow-lg">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/30 rounded-3xl mx-4 md:mx-8 lg:mx-16">
        <div className="text-center space-y-6 md:space-y-8 max-w-2xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight font-serif mb-4">
              Stay in the Loop
            </h2>
            <p className="text-base md:text-lg text-muted-foreground">
              Get weekly writing tips, featured stories, and exclusive content delivered to your inbox.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 md:py-3 text-sm md:text-base rounded-full border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Button className="rounded-full px-6 md:px-8 py-2.5 md:py-3 text-sm md:text-base bg-primary hover:bg-primary/90 transition-colors">
              Subscribe
            </Button>
          </motion.div>

          <motion.p
            className="text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            Join 50,000+ writers who trust us. Unsubscribe anytime.
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 md:py-12 lg:py-16 border-t border-border">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
            <div className="space-y-3 md:space-y-4 sm:col-span-2 md:col-span-1">
              <h3 className="text-base md:text-lg font-semibold font-serif">blog19</h3>
              <p className="text-sm text-muted-foreground">
                A modern platform for writers and readers to connect, share ideas, and build community.
              </p>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-medium text-sm md:text-base">Platform</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <Link href="/create" className="block hover:text-foreground transition-colors">Write</Link>
                <Link href="#featured-stories-heading" className="block hover:text-foreground transition-colors">Read</Link>
                <Link href="/login" className="block hover:text-foreground transition-colors">Login</Link>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-medium text-sm md:text-base">Company</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">About</a>
                <a href="#" className="block hover:text-foreground transition-colors">Careers</a>
                <a href="#" className="block hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>

            <div className="space-y-3 md:space-y-4">
              <h4 className="font-medium text-sm md:text-base">Support</h4>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="#" className="block hover:text-foreground transition-colors">Help Center</a>
                <a href="#" className="block hover:text-foreground transition-colors">Community</a>
                <a href="#" className="block hover:text-foreground transition-colors">Privacy</a>
              </div>
            </div>
          </div>

          <div className="pt-6 md:pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-3 md:gap-4">
            <p className="text-xs md:text-sm text-muted-foreground">
              © 2024 blog19. All rights reserved.
            </p>
            <div className="flex items-center gap-4 md:gap-6 text-xs md:text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}