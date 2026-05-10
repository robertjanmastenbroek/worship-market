"use client"
import React, { useContext } from 'react';
import { ShoppingBag, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { AppStateContext } from '../StateProvider';

export default function Navbar() {
    const context = useContext(AppStateContext);
    
    if (!context) {
        // Return a minimal navbar if context isn't available yet
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
                </div>
            </nav>
        );
    }
    const { view, setView, cart, user, setUser, isMenuOpen, setIsMenuOpen, setIsCartOpen, setIsAuthModalOpen, setIsPartnerModalOpen, supabase } = context;

    const handleSignOut = async () => {
        if (supabase?.auth) {
            await supabase.auth.signOut();
        }
        setUser(null);
        window.location.href = '/';
    };

    return (
        <>
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
                        {user && <Link href="/profile" className={`text-sm font-medium transition-colors ${view === 'profile' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>Profile</Link>}
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
                            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-white/10">
                                <div className="h-8 w-8 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-200">
                                    {user?.name?.[0]?.toUpperCase() || '?'}
                                </div>
                                <span className="text-sm font-medium text-slate-200">{user?.name || 'User'}</span>
                                <button 
                                    type="button"
                                    onClick={handleSignOut}
                                    className="ml-2 px-2 py-1 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs cursor-pointer"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button className="hidden md:block px-4 py-1.5 rounded-full bg-white text-black text-sm font-bold hover:bg-indigo-50 transition-colors" onClick={() => setIsAuthModalOpen(true)}>
                                Sign In
                            </button>
                        )}
                        <button className="md:hidden text-slate-300 p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Drawer */}
            {isMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" 
                        onClick={() => setIsMenuOpen(false)}
                    />
                    
                    {/* Menu Panel */}
                    <div className="absolute top-0 right-0 h-full w-64 bg-slate-900 border-l border-white/10 shadow-2xl transform transition-transform duration-300 translate-x-0">
                        <div className="flex flex-col h-full">
                            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-white">Menu</h2>
                            <button onClick={() => setIsMenuOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                <X size={20} className="text-slate-400" />
                            </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            <Link 
                                href="/marketplace"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'marketplace' ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                Explore
                            </Link>
                            <Link 
                                href="/purchases"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'purchases' ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                Purchases
                            </Link>
                            <Link 
                                href="/dashboard"
                                onClick={() => setIsMenuOpen(false)}
                                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                            >
                                Dashboard
                            </Link>
                            {user && (
                                <Link 
                                    href="/profile"
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${view === 'profile' ? 'bg-indigo-600/20 text-white border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}
                                >
                                    Profile
                                </Link>
                            )}
                            </div>

                            <div className="p-4 border-t border-white/10 space-y-2">
                            {user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800/50">
                                        <div className="h-10 w-10 rounded-full bg-indigo-900/50 border border-indigo-500/30 flex items-center justify-center text-sm font-bold text-indigo-200">
                                            {user?.name?.[0]?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-white truncate">{user?.name || 'User'}</div>
                                            <div className="text-xs text-slate-400 capitalize">{user?.role || ''}</div>
                                        </div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={handleSignOut}
                                        className="w-full px-4 py-3 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-sm font-medium transition-colors cursor-pointer"
                                    >
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={() => {
                                        setIsAuthModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="w-full px-4 py-3 rounded-lg bg-white text-black text-sm font-bold hover:bg-indigo-50 transition-colors"
                                >
                                    Sign In
                                </button>
                            )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
