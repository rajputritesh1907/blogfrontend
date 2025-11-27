'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';

export default function Home() {
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
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-0 w-[800px] h-[400px] bg-secondary/20 rounded-full blur-3xl opacity-30" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-8 max-w-4xl mx-auto px-4"
        >
          <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-background/50 backdrop-blur-sm">
            <Sparkles className="mr-2 h-3.5 w-3.5 text-primary" />
            <span className="text-muted-foreground">Welcome to the future of blogging</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent font-serif">
            Share your stories with the world.
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Antigravity is a modern platform for writers and readers. Discover compelling ideas, knowledge, and perspectives in a space designed for clarity.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                Start Reading
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/create">
              <Button variant="outline" size="lg" className="rounded-full px-8 text-base h-12 w-full sm:w-auto">
                Start Writing
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Posts */}
      <section className="space-y-10" aria-labelledby="featured-stories-heading">
        <div className="flex items-center justify-between">
          <h2 id="featured-stories-heading" className="text-3xl font-bold tracking-tight font-serif">Featured Stories</h2>
          <Button variant="ghost" size="sm" className="text-sm sm:text-base" aria-label="View all featured stories">View all</Button>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {[1, 2, 3].map((i) => (
            <motion.div key={i} variants={item}>
              <Card
                className="group cursor-pointer border-0 bg-transparent shadow-none hover:bg-card/50 transition-colors p-0 focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-2xl"
                role="button"
                tabIndex={0}
                aria-label={`Read article: The Future of Web Development: What to Expect in 2026 by Jane Smith`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    // Handle navigation here
                  }
                }}
              >
                <div className="aspect-[16/10] rounded-2xl overflow-hidden mb-4 relative">
                  <div className="absolute inset-0 bg-muted/50 group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center rounded-full bg-background/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm" aria-label="Category: Technology">
                      Technology
                    </span>
                  </div>
                </div>
                <div className="space-y-3 px-2">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <span className="flex items-center" aria-label="5 minute read">
                      <Clock className="w-3 h-3 mr-1" aria-hidden="true" /> 5 min read
                    </span>
                    <span aria-hidden="true">•</span>
                    <time dateTime="2025-11-27" aria-label="Published November 27, 2025">Nov 27, 2025</time>
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 font-serif">
                    The Future of Web Development: What to Expect in 2026
                  </h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    Explore the latest trends in frontend frameworks, server-side rendering, and the evolution of the web platform as we move towards a more distributed web.
                  </p>
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="w-6 h-6 rounded-full bg-muted" aria-hidden="true" />
                    <span className="text-sm font-medium">Jane Smith</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="rounded-3xl bg-muted/30 p-8 md:p-12" aria-labelledby="trending-heading">
        <div className="flex items-center space-x-2 mb-8">
          <TrendingUp className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 id="trending-heading" className="text-2xl font-bold font-serif">Trending Now</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex gap-4 items-start group cursor-pointer focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg p-2 -m-2"
              role="button"
              tabIndex={0}
              aria-label={`Read trending article: Understanding the basics of Quantum Computing by John Doe, rank ${i}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  // Handle navigation here
                }
              }}
            >
              <span className="text-3xl font-bold text-muted-foreground/20 group-hover:text-primary/20 transition-colors" aria-hidden="true">0{i}</span>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <div className="w-5 h-5 rounded-full bg-muted" aria-hidden="true" />
                  <span>John Doe</span>
                </div>
                <h3 className="font-bold group-hover:text-primary transition-colors">
                  Understanding the basics of Quantum Computing
                </h3>
                <p className="text-xs text-muted-foreground">
                  <time dateTime="2025-11-26" aria-label="Published November 26, 2025">Nov 26</time> • <span aria-label="3 minute read">3 min read</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
