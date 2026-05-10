"use client";

import React, { useContext, useEffect, useState, useMemo } from 'react';
import { AppStateContext } from '../../StateProvider';
import { Upload, ShieldCheck, Package, ShoppingBag, DollarSign, Clock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalEarnings: number;
    activeListings: number;
    partnerScore: number;
    pendingOrders: number;
    completedOrders: number;
    isLoading: boolean;
}

export default function DashboardPage() {
    const context = useContext(AppStateContext);

    if (!context) {
        return <DashboardSkeleton />;
    }

    const { user, products, orders, setIsListingModalOpen } = context;

    // Filter products that belong to the user
    const userProducts = useMemo(() => {
        if (!user) return [];
        const userName = user.name?.toLowerCase() || '';
        const userEmail = user.email?.toLowerCase() || '';
        return products.filter((p: any) => {
            const author = (p.author || '').toLowerCase();
            const sellerEmail = (p.seller_email || '').toLowerCase();
            return author === userName || sellerEmail === userEmail || p.seller_id === user.id;
        });
    }, [products, user]);

    // Compute stats from real data
    const stats = useMemo((): DashboardStats => {
        const userOrders = orders.filter((o: any) => o.seller_id === user?.id);
        const sellerPayout = userOrders.reduce((sum: number, o: any) => sum + (o.seller_payout || o.price * 0.85 || 0), 0);
        const pendingCount = userOrders.filter((o: any) => o.status === 'pending' || o.status === 'in_progress').length;
        const completedCount = userOrders.filter((o: any) => o.status === 'completed').length;

        return {
            totalEarnings: sellerPayout,
            activeListings: userProducts.length,
            partnerScore: user?.partnerScore || user?.verified ? 98 : 0,
            pendingOrders: pendingCount,
            completedOrders: completedCount,
            isLoading: false,
        };
    }, [orders, user, userProducts]);

    // If user has no products but has a profile, they might be a new partner
    const isNewPartner = !stats.isLoading && userProducts.length === 0 && orders.length === 0;

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Partner Dashboard</h2>
                        <p className="text-slate-400 text-sm">
                            Welcome back, {user?.name || 'Creator'}. Let's build the Kingdom.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsListingModalOpen(true)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all w-full sm:w-auto active:scale-95"
                    >
                        <Upload size={18} />
                        <span>New Listing</span>
                    </button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatsCard
                        label="Total Earnings"
                        value={`$${stats.totalEarnings.toFixed(2)}`}
                        icon={<DollarSign size={18} />}
                        subtitle={stats.totalEarnings > 0 ? 'Lifetime revenue' : 'No earnings yet'}
                        accent="emerald"
                    />
                    <StatsCard
                        label="Active Listings"
                        value={String(stats.activeListings)}
                        icon={<Package size={18} />}
                        subtitle={stats.activeListings > 0 ? `${stats.activeListings} products live` : 'No listings yet'}
                        accent="indigo"
                    />
                    <StatsCard
                        label="Pending Orders"
                        value={String(stats.pendingOrders)}
                        icon={<Clock size={18} />}
                        subtitle={stats.pendingOrders > 0 ? 'Needs your attention' : 'All caught up'}
                        accent="amber"
                        warn={stats.pendingOrders > 0}
                    />
                    <StatsCard
                        label="Partner Score"
                        value={String(stats.partnerScore)}
                        icon={<ShieldCheck size={18} />}
                        subtitle={stats.partnerScore >= 90 ? 'Excellent standing' : 'Building reputation'}
                        accent="emerald"
                    />
                </div>

                {/* New Partner Onboarding */}
                {isNewPartner && (
                    <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-6 mb-10">
                        <div className="flex items-start gap-4">
                            <div className="h-12 w-12 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                                <Upload size={20} className="text-indigo-400" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold mb-1">Ready to share your gifts?</h3>
                                <p className="text-slate-400 text-sm mb-4">
                                    Your partner profile is set up. Create your first listing to start reaching church leaders and worship teams worldwide.
                                </p>
                                <button
                                    onClick={() => setIsListingModalOpen(true)}
                                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    Create Your First Listing
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* User's Listings */}
                <div className="bg-slate-900/30 border border-white/10 rounded-xl overflow-hidden mb-10">
                    <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50 flex items-center justify-between">
                        <h3 className="font-bold text-white">Your Active Listings</h3>
                        {userProducts.length > 0 && (
                            <span className="text-xs text-slate-500">{userProducts.length} product{userProducts.length !== 1 ? 's' : ''}</span>
                        )}
                    </div>
                    {userProducts.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Package size={36} className="mx-auto text-slate-600 mb-3" />
                            <p className="text-slate-400 text-sm">No listings yet.</p>
                            <button
                                onClick={() => setIsListingModalOpen(true)}
                                className="mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition-colors"
                            >
                                + Create your first listing
                            </button>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {userProducts.slice(0, 10).map((item: any) => (
                                <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4 min-w-0">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=100&auto=format&fit=crop'}
                                            className="h-10 w-10 rounded-md object-cover bg-slate-800 shrink-0"
                                            alt={item.title}
                                        />
                                        <div className="min-w-0">
                                            <div className="text-sm font-medium text-white truncate">{item.title}</div>
                                            <div className="text-xs text-slate-500 capitalize">{item.type} • ${item.price}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 shrink-0">
                                        <span className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">
                                            Active
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Orders */}
                {orders.length > 0 && (
                    <div className="bg-slate-900/30 border border-white/10 rounded-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50">
                            <h3 className="font-bold text-white">Recent Orders</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {orders.filter((o: any) => o.seller_id === user?.id).slice(0, 5).map((order: any) => (
                                <div key={order.orderId || order.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-md bg-slate-800 flex items-center justify-center">
                                            <ShoppingBag size={16} className="text-slate-500" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-white">{order.title || 'Order'}</div>
                                            <div className="text-xs text-slate-500">
                                                #{order.orderId || order.id?.slice(0, 8)} • {new Date(order.purchaseDate || order.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-indigo-400">
                                            ${(order.seller_payout || order.price * 0.85 || 0).toFixed(2)}
                                        </span>
                                        <span className={`text-xs font-bold px-2 py-1 rounded ${
                                            order.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                                            order.status === 'in_progress' ? 'bg-amber-500/10 text-amber-400' :
                                            'bg-slate-500/10 text-slate-400'
                                        }`}>
                                            {order.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* No activity state */}
                {!isNewPartner && orders.length === 0 && userProducts.length === 0 && (
                    <div className="text-center py-12 bg-slate-900/20 border border-white/5 rounded-xl">
                        <ShoppingBag size={40} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">No orders or listings yet.</p>
                        <p className="text-slate-500 text-sm mt-1">Your dashboard will fill up as you create listings and receive orders.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatsCard({ label, value, icon, subtitle, accent = 'indigo', warn = false }: {
    label: string;
    value: string;
    icon: React.ReactNode;
    subtitle: string;
    accent?: 'indigo' | 'emerald' | 'amber';
    warn?: boolean;
}) {
    const accentColors = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };

    return (
        <div className="bg-slate-900/50 border border-white/10 p-5 rounded-xl backdrop-blur-sm hover:border-white/20 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${accentColors[accent]}`}>
                    {icon}
                </div>
            </div>
            <div className={`text-2xl font-bold text-white ${warn ? 'animate-pulse' : ''}`}>{value}</div>
            <div className="text-slate-500 text-xs mt-1">{subtitle}</div>
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto animate-pulse">
                <div className="h-8 w-48 bg-slate-800 rounded mb-2" />
                <div className="h-4 w-64 bg-slate-800 rounded mb-8" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="bg-slate-900/50 border border-white/10 p-5 rounded-xl">
                            <div className="h-3 w-24 bg-slate-800 rounded mb-3" />
                            <div className="h-8 w-16 bg-slate-800 rounded mb-2" />
                            <div className="h-3 w-20 bg-slate-800 rounded" />
                        </div>
                    ))}
                </div>
                <div className="bg-slate-900/30 border border-white/10 rounded-xl">
                    <div className="px-6 py-4 border-b border-white/10">
                        <div className="h-5 w-36 bg-slate-800 rounded" />
                    </div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="px-6 py-4 flex items-center gap-4">
                            <div className="h-10 w-10 bg-slate-800 rounded-md" />
                            <div className="flex-1">
                                <div className="h-4 w-48 bg-slate-800 rounded mb-1" />
                                <div className="h-3 w-24 bg-slate-800 rounded" />
                            </div>
                            <div className="h-5 w-14 bg-slate-800 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
