"use client";

import React, { useContext } from 'react';
import { AppStateContext } from '../../StateProvider';
import { ProductCard } from '../../components/ProductCard';
import { Search, Music, Mic2, FileText } from 'lucide-react';

export default function MarketplacePage() {
    const context = useContext(AppStateContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const {
        products,
        filter,
        setFilter,
        handlePlay,
        addToCart,
        setSelectedProduct,
        isPlaying,
        activeTrack
    } = context;

    const filteredProducts =
        filter === 'all'
            ? products
            : products.filter((p: any) => p.type === filter);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">The Market</h2>
                    <p className="text-slate-400">Curated assets and services for your ministry.</p>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search for pads, mixing, graphics..."
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-900/50 border border-white/10 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {[
                    { id: 'all', label: 'All Items' },
                    { id: 'service', label: 'Services', icon: Mic2 },
                    { id: 'asset', label: 'Assets', icon: Music },
                    { id: 'knowledge', label: 'Knowledge', icon: FileText }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setFilter(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition-all whitespace-nowrap ${filter === tab.id
                            ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20'
                            : 'bg-slate-900/30 border-white/10 text-slate-400 hover:border-white/20 hover:text-white'
                            }`}
                    >
                        {tab.icon && <tab.icon size={14} />}
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-24">
                {filteredProducts.map((product: any) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                        onPlay={handlePlay}
                        onAddToCart={addToCart}
                        onClick={setSelectedProduct}
                        isPlaying={isPlaying && activeTrack?.id === product.id}
                    />
                ))}
            </div>
        </div>
    );
}