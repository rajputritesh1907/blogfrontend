'use client';

import { createContext, useState, useEffect, useContext } from 'react';
import api from '../lib/api';
import { useRouter } from 'next/navigation';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const { success, error } = useToast();

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            const token = localStorage.getItem('token');
            console.log('Checking auth on app load, token exists:', !!token);

            if (token) {
                try {
                    const { data } = await api.get('/auth/me');
                    console.log('User authenticated:', data);
                    setUser(data);
                } catch (error) {
                    console.error('Auth check failed:', error);
                    localStorage.removeItem('token');
                }
            } else {
                console.log('No token found, user not authenticated');
            }
            setLoading(false);
        };

        checkUserLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            success('Welcome back! You have been logged in successfully.');
            router.push('/');
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed. Please check your credentials.';
            error(message);
            return {
                success: false,
                message
            };
        }
    };

    const register = async (name, email, password) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            setUser(data);
            success('Account created successfully! Welcome to blog19.');
            router.push('/');
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            error(message);
            return {
                success: false,
                message
            };
        }
    };

    const updateUser = (updatedUserData) => {
        setUser(prev => ({ ...prev, ...updatedUserData }));
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        success('You have been logged out successfully.');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
