import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../context/ToastContext';
import ErrorBoundary from '../components/ErrorBoundary';
import ToastContainer from '../components/Toast';
import Navbar from '../components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata = {
  title: 'blog19 - A Modern Blogging Platform',
  description: 'A modern blog platform built with Next.js and Express',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} antialiased min-h-screen bg-background text-foreground font-sans`}>
        <ErrorBoundary>
          <ToastProvider>
            <ThemeProvider>
              <AuthProvider>
                <Navbar />
                <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  {children}
                </main>
                <ToastContainer />
              </AuthProvider>
            </ThemeProvider>
          </ToastProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
