"use client"
import React, { useContext } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { AppStateContext } from '../StateProvider';

export default function Navbar() {
    const context = useContext(AppStateContext);
    if (!context) {
        throw new Error('AppStateContext not found');
    }
    const { view, setView, cart, user, isMenuOpen, setIsMenuOpen, setIsCartOpen, setIsAuthModalOpen, setIsPartnerModalOpen, supabase } = context;

    return (
        <nav className="sticky top-0 z-40 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 cursor-pointer group">
                    <div className="h-8 w-8 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="text-white font-bold text-lg">W</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-white group-hover:text-indigo-100">
                        Worship<span className="text-indigo-400">Market</span>
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/marketplace" className={`text-sm font-medium transition-colors ${view === 'marketplace' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Explore</Link>
                    <Link href="/purchases" className={`text-sm font-medium transition-colors ${view === 'purchases' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Purchases</Link>
                    <Link href="/dashboard" className={`text-sm font-medium transition-colors ${view === 'dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Dashboard</Link>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group cursor-pointer" onClick={() => setIsCartOpen(true)}>
                        <ShoppingBag className="text-slate-400 group-hover:text-white transition-colors" size={20} />
                        {cart.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-indigo-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center animate-bounce">
                                {cart.length}
                            </span>
                        )}
                    </div>

                    {user ? (
                        <div className="flex items-center gap-2 pl-4 border-l border-white/10">
                            <div className="h-8 w-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-200">
                                {user.name?.[0]?.toUpperCase() || '?'}
                            </div>
                            <span className="hidden md:block text-sm font-medium text-slate-200">{user.name}</span>
                            <button onClick={async () => { await supabase.auth.signOut(); context.setUser(null); }} className="ml-2 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs">Sign Out</button>
                        </div>
                    ) : (
                        <button className="px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold hover:bg-indigo-50 transition-colors" onClick={() => setIsAuthModalOpen(true)}>
                            Sign In
                        </button>
                    )}
                    <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X /> : <Menu />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
