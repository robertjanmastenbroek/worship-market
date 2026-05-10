"use client"
import React, { useState, useEffect } from 'react';
import { createClient } from '../lib/supabase/client';
import { INITIAL_PRODUCTS } from '../lib/mock-data';

export const AppStateContext = React.createContext<any>(null);

export const AppStateProvider = ({ children }: { children: React.ReactNode }) => {
    const [view, setView] = useState('marketplace');
    const [filter, setFilter] = useState('all');

    // REAL STATE (Replaces simple MOCK)
    const [products, setProducts] = useState(INITIAL_PRODUCTS);
    const [orders, setOrders] = useState<any[]>([]); // Fulfillment State
    const [cart, setCart] = useState<any[]>([]);

    const [activeTrack, setActiveTrack] = useState<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    const supabase = createClient();

    // Helper function to transform database product to UI format
    const transformProduct = (dbProduct: any) => {
        const profile = dbProduct.profiles || {};
        return {
            ...dbProduct,
            id: dbProduct.id,
            image: dbProduct.image_url || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=1000&auto=format&fit=crop',
            audioUrl: dbProduct.audio_url || null,
            author: profile.full_name || profile.email || 'Unknown',
            authorVerified: profile.verified || false,
            reviews: dbProduct.review_count || 0,
            tags: dbProduct.tags || [],
        };
    };

    // Helper function to fetch and transform products
    const fetchAndTransformProducts = async () => {
        // Check if Supabase is properly configured
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey || !supabase?.from) {
            // Use mock data if Supabase isn't configured
            return;
        }

        try {
            const { data, error } = await supabase
                .from('products')
                .select(`
                    *,
                    profiles!products_seller_id_fkey (
                        id,
                        email,
                        full_name,
                        role,
                        verified
                    )
                `)
                .eq('active', true)
                .order('created_at', { ascending: false });

            if (!error && data) {
                const transformedProducts = data.map(transformProduct);
                setProducts(transformedProducts.length > 0 ? transformedProducts : INITIAL_PRODUCTS);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            // Continue with mock data on error
        }
    };

    // On mount, check for session and fetch products
    useEffect(() => {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        
        if (!supabaseUrl || !supabaseAnonKey || !supabase?.auth) {
            // Skip auth check if Supabase isn't configured
            return;
        }

        const getSession = async () => {
            try {
                const { data, error } = await supabase.auth.getUser();
                if (data?.user) {
                    setUser({
                        name: data.user.email,
                        role: data.user.user_metadata?.role || 'leader',
                        verified: !!data.user.user_metadata?.statement_of_faith_agreed,
                    });
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Error getting session:', error);
                setUser(null);
            }
        };
        getSession();
        // Listen for auth changes
        let listener: any = null;
        try {
            if (supabase?.auth) {
                const result = supabase.auth.onAuthStateChange(() => getSession());
                listener = result?.data;
            }
        } catch (error) {
            console.error('Error setting up auth listener:', error);
        }
        
        return () => {
            if (listener?.subscription) {
                listener.subscription.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch products from Supabase on mount
    useEffect(() => {
        fetchAndTransformProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Checkout State
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState('payment');

    // Chat State
    const [activeChatOrder, setActiveChatOrder] = useState<any>(null);

    // Partner Modal
    const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
    const [hasAgreedToCreed, setHasAgreedToCreed] = useState(false);

    // New Listing Modal
    const [isListingModalOpen, setIsListingModalOpen] = useState(false);

    // Audio Logic
    useEffect(() => {
        if (activeTrack && isPlaying) {
            console.log(`Simulated Audio Play: ${activeTrack.title}`);
        }
    }, [activeTrack, isPlaying]);

    const handlePlay = (track: any) => {
        if (activeTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setActiveTrack(track);
            setIsPlaying(true);
        }
    };

    const addToCart = (product: any) => {
        setCart([...cart, product]);
        setIsCartOpen(true);
    };

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const handleCheckoutSuccess = () => {
        // Convert Cart Items to Orders
        const newOrders = cart.map(item => ({
            ...item,
            purchaseDate: new Date().toISOString(),
            status: item.type === 'service' ? 'in_progress' : 'delivered',
            orderId: Math.floor(Math.random() * 1000000)
        }));

        setOrders([...orders, ...newOrders]);
        setCheckoutStep('success');
        setCart([]);
    };

    const handlePublishListing = async (productData: any) => {
        // Product data comes from CreateListingModal
        // It needs to be transformed to match the database schema
        try {
            const dbProductData = {
                type: productData.type,
                category: productData.category,
                title: productData.title,
                description: productData.description || '',
                price: productData.price,
                image_url: productData.image || null,
                delivery_time: productData.deliveryTime || null,
                file_size: productData.fileSize || null,
            };

            // Call API route to avoid bundling issues (following LAYOUT_INTEGRITY rules)
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dbProductData),
            });

            const result = await response.json();
            
            if (result.error) {
                console.error('Error creating product:', result.error);
                alert('Error creating product: ' + result.error);
                return { error: result.error };
            }

            // Refresh products list to show the new product
            await fetchAndTransformProducts();
            
            // Return success - the modal will close itself
            return { success: true };
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Error creating product. Please try again.');
            return { error: 'Failed to create product' };
        }
    };

    const state = {
        view, setView,
        filter, setFilter,
        products, setProducts,
        orders, setOrders,
        cart, setCart,
        activeTrack, setActiveTrack,
        isPlaying, setIsPlaying,
        isCartOpen, setIsCartOpen,
        selectedProduct, setSelectedProduct,
        user, setUser,
        isAuthModalOpen, setIsAuthModalOpen,
        isMenuOpen, setIsMenuOpen,
        isCheckoutOpen, setIsCheckoutOpen,
        checkoutStep, setCheckoutStep,
        activeChatOrder, setActiveChatOrder,
        isPartnerModalOpen, setIsPartnerModalOpen,
        hasAgreedToCreed, setHasAgreedToCreed,
        isListingModalOpen, setIsListingModalOpen,
        handlePlay,
        addToCart,
        removeFromCart,
        handleCheckoutSuccess,
        handlePublishListing,
        supabase
    }

    return (
        <AppStateContext.Provider value={state}>
            {children}
        </AppStateContext.Provider>
    )
}
