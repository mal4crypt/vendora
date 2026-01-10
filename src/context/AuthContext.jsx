import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { fetchWithRetry } from '../utils/network';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active sessions and subscribe to auth changes
        const checkUser = async () => {
            const timeout = setTimeout(() => {
                setLoading(false);
            }, 1000); // Super fast 1s timeout

            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    // Fetch profile data
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .maybeSingle();

                    if (!profileError && profile) {
                        setUser({ ...session.user, ...profile });
                    } else {
                        setUser(session.user);
                    }
                }
            } catch (err) {
                console.error('Auth initialization error:', err);
            } finally {
                clearTimeout(timeout);
                setLoading(false);
            }
        };

        checkUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .maybeSingle();
                setUser({ ...session.user, ...profile });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            // DIRECT RAW FETCH - bypassing SDK hang completely
            const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
            const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

            const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                console.error('Login error:', data);
                throw new Error(data.error_description || data.msg || 'Invalid login credentials');
            }

            // Race setSession against a 2s timeout
            // If the SDK is broken/hanging, we just skip this and set state manually
            const setSessionPromise = supabase.auth.setSession({
                access_token: data.access_token,
                refresh_token: data.refresh_token
            });

            const timeoutPromise = new Promise((resolve) => setTimeout(() => resolve('TIMEOUT'), 2000));

            const result = await Promise.race([setSessionPromise, timeoutPromise]);

            if (result === 'TIMEOUT') {
                console.warn('SDK setSession timed out. Manually setting state.');
                // Manually set user state since SDK refused to
                setUser({ ...data.user, session: data });
            } else if (result.error) {
                throw result.error;
            }

            return { user: data.user, session: data };
        } catch (err) {
            console.error('Direct login failed:', err);
            throw err;
        }
    };

    const register = async (email, password, metadata) => {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: metadata.name,
                    role: metadata.role
                }
            }
        });

        if (error) throw error;

        // Create profile in profiles table
        if (data.user) {
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: data.user.id,
                        full_name: metadata.name,
                        role: metadata.role,
                        city: metadata.city,
                        state: metadata.state,
                        commission_agreed: metadata.commission_agreed || false
                    }
                ]);
            if (profileError) throw profileError;
        }

        return data;
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            // Optionally clear any local storage if used purely for auth caching
        }
    };

    const resetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    };

    const updatePassword = async (newPassword) => {
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });
        if (error) throw error;
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, resetPassword, updatePassword, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
