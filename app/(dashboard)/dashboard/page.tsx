"use client";

import React, { useContext } from 'react';
import { AppStateContext } from '../../StateProvider';
import { Upload, ShieldCheck } from 'lucide-react';

export default function DashboardPage() {
    const context = useContext(AppStateContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { user, products, setIsListingModalOpen } = context;

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">Partner Dashboard</h2>
                        <p className="text-slate-400 text-sm">Welcome back, {user?.name}. Let's build the Kingdom.</p>
                    </div>
                    <button onClick={() => setIsListingModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium shadow-lg shadow-indigo-500/20 transition-all">
                        <Upload size={18} />
                        <span>New Listing</span>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Total Earnings</div>
                        <div className="text-3xl font-bold text-white">,240.50</div>
                        <div className="text-emerald-400 text-xs mt-2 flex items-center gap-1"><span className="bg-emerald-400/10 px-1 rounded">+12%</span> this month</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Active Services</div>
                        <div className="text-3xl font-bold text-white">4</div>
                        <div className="text-indigo-400 text-xs mt-2">2 orders in queue</div>
                    </div>
                    <div className="bg-slate-900/50 border border-white/10 p-6 rounded-xl backdrop-blur-sm">
                        <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">Partner Score</div>
                        <div className="text-3xl font-bold text-white flex items-center gap-2">
                            98 <ShieldCheck className="text-emerald-400" size={24} />
                        </div>
                        <div className="text-slate-500 text-xs mt-2">Verified & Theologically Safe</div>
                    </div>
                </div>

                <div className="bg-slate-900/30 border border-white/10 rounded-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50">
                        <h3 className="font-bold text-white">Your Active Listings</h3>
                    </div>
                    <div className="divide-y divide-white/5">
                        {products.filter((p: any) => p.author.includes('You') || p.id <= 6).slice(0, 5).map((item: any) => (
                            <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} className="h-10 w-10 rounded-md object-cover bg-slate-800" />
                                    <div>
                                        <div className="text-sm font-medium text-white">{item.title}</div>
                                        <div className="text-xs text-slate-500 capitalize">{item.type} • ${item.price}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-xs font-bold bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded">Active</div>
                                    <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white">Edit</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}