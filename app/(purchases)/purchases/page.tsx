"use client";

import React, { useContext } from 'react';
import { AppStateContext } from '../../StateProvider';
import { ShoppingBag, MoreHorizontal, Download, MessageSquare } from 'lucide-react';
import { TypeIcon } from '@/app/components/TypeIcon';
import Link from 'next/link';

export default function PurchasesPage() {
    const context = useContext(AppStateContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { orders, setActiveChatOrder } = context;

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-white mb-6">Your Purchases</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-white/5">
                        <ShoppingBag size={48} className="mx-auto text-slate-600 mb-4" />
                        <p className="text-slate-400">You haven't bought anything yet.</p>
                        <Link href="/marketplace" className="text-indigo-400 hover:underline mt-2">Browse Market</Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order: any) => (
                            <div key={order.orderId} className="bg-slate-900/50 border border-white/10 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 bg-slate-800 rounded-lg overflow-hidden">
                                        <img src={order.image} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white">{order.title}</h4>
                                        <p className="text-xs text-slate-400">Order #{order.orderId} • {new Date(order.purchaseDate).toLocaleDateString()}</p>
                                        <div className="mt-1 flex items-center gap-2">
                                            <TypeIcon type={order.type} />
                                            <span className="text-xs text-slate-300 capitalize">{order.type}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {order.type === 'service' ? (
                                        <button
                                            onClick={() => setActiveChatOrder(order)}
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg flex items-center gap-2"
                                        >
                                            <MessageSquare size={16} /> Open Workroom
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => alert(`Downloading ${order.title}... (Secure Link Generated)`)}
                                            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-white/10 text-white text-sm font-bold rounded-lg flex items-center gap-2"
                                        >
                                            <Download size={16} /> Download
                                        </button>
                                    )}
                                    <button className="p-2 border border-white/10 rounded-lg text-slate-400 hover:text-white">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}