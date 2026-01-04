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

    // On mount, check for session
    useEffect(() => {
        const getSession = async () => {
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
        };
        getSession();
        // Listen for auth changes
        const { data: listener } = supabase.auth.onAuthStateChange(() => getSession());
        return () => { listener?.subscription.unsubscribe(); };
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

    const handlePublishListing = (newProduct: any) => {
        setProducts([newProduct, ...products]);
        setView('marketplace'); // Redirect to see your new baby
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
