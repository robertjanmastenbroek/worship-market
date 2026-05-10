"use client";

import React, { useContext, useEffect, useState } from 'react';
import { AppStateContext } from '../StateProvider';
import { ShieldCheck, Mail, Calendar, Package, Star, Edit3, Save, X, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const context = useContext(AppStateContext);
    const router = useRouter();

    if (!context) {
        return <ProfileSkeleton />;
    }

    const { user, products, orders, supabase } = context;
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [bio, setBio] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // If not logged in, redirect
    useEffect(() => {
        if (!user) {
            router.push('/');
        }
    }, [user, router]);

    if (!user) {
        return <ProfileSkeleton />;
    }

    const userProducts = products.filter((p: any) =>
        p.author?.toLowerCase() === user.name?.toLowerCase() ||
        p.seller_id === user.id
    );

    const userOrders = orders.filter((o: any) =>
        o.buyer_id === user.id || o.seller_id === user.id
    );

    const handleSave = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        try {
            if (supabase?.from) {
                const { error: updateError } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        full_name: fullName || user.name,
                        bio: bio,
                        updated_at: new Date().toISOString(),
                    }, { onConflict: 'id' });

                if (updateError) throw updateError;
            }
            setSuccess('Profile updated.');
            setEditing(false);
        } catch (err: any) {
            setError(err.message || 'Failed to save profile');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
                    <div className="h-20 w-20 rounded-full bg-indigo-900/50 border-2 border-indigo-500/30 flex items-center justify-center shrink-0">
                        <span className="text-3xl font-bold text-indigo-200">
                            {(fullName || user.name || '?')[0]?.toUpperCase()}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-2xl font-bold text-white">{fullName || user.name || 'Creator'}</h1>
                            {user.verified && (
                                <span className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
                                    <ShieldCheck size={10} /> VERIFIED
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-slate-400 mt-1">
                            <span className="flex items-center gap-1.5">
                                <Mail size={14} /> {user.email || user.name}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} /> Joined {user.joinedAt || 'recently'}
                            </span>
                        </div>
                        {editing ? (
                            <div className="mt-4 space-y-3">
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Full name"
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500"
                                />
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    placeholder="Tell us about yourself and your creative work..."
                                    rows={3}
                                    className="w-full px-3 py-2 bg-slate-800 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-indigo-500 resize-none"
                                />
                                {error && <p className="text-red-400 text-xs">{error}</p>}
                                {success && <p className="text-emerald-400 text-xs">{success}</p>}
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Save
                                    </button>
                                    <button
                                        onClick={() => setEditing(false)}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 border border-white/10 hover:border-white/20 text-slate-300 text-sm font-medium rounded-lg transition-colors"
                                    >
                                        <X size={14} /> Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="mt-3">
                                {bio ? (
                                    <p className="text-slate-300 text-sm">{bio}</p>
                                ) : (
                                    <p className="text-slate-500 text-sm italic">No bio yet.</p>
                                )}
                                <button
                                    onClick={() => setEditing(true)}
                                    className="mt-2 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                                >
                                    <Edit3 size={12} /> Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    <StatCard icon={<Package size={18} />} label="Products" value={String(userProducts.length)} accent="indigo" />
                    <StatCard icon={<Star size={18} />} label="Orders" value={String(userOrders.length)} accent="amber" />
                    <StatCard icon={<ShieldCheck size={18} />} label="Verified" value={user.verified ? 'Yes' : 'Pending'} accent="emerald" />
                    <StatCard icon={<Calendar size={18} />} label="Role" value={user.role || 'Leader'} accent="indigo" />
                </div>

                {/* Products */}
                {userProducts.length > 0 && (
                    <div className="bg-slate-900/30 border border-white/10 rounded-xl overflow-hidden mb-10">
                        <div className="px-6 py-4 border-b border-white/10 bg-slate-900/50">
                            <h3 className="font-bold text-white">Listings ({userProducts.length})</h3>
                        </div>
                        <div className="divide-y divide-white/5">
                            {userProducts.slice(0, 5).map((item: any) => (
                                <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} className="h-10 w-10 rounded-md object-cover bg-slate-800" alt={item.title} />
                                        <div>
                                            <div className="text-sm font-medium text-white">{item.title}</div>
                                            <div className="text-xs text-slate-500">${item.price} • {item.type}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, accent = 'indigo' }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
    const colors: Record<string, string> = {
        indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
        emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    };
    return (
        <div className="bg-slate-900/50 border border-white/10 p-5 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
                <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${colors[accent] || colors.indigo}`}>
                    {icon}
                </div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">{label}</span>
            </div>
            <div className="text-xl font-bold text-white">{value}</div>
        </div>
    );
}

function ProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 py-10 animate-pulse">
            <div className="max-w-3xl mx-auto">
                <div className="flex gap-6 mb-10">
                    <div className="h-20 w-20 bg-slate-800 rounded-full" />
                    <div className="flex-1">
                        <div className="h-7 w-40 bg-slate-800 rounded mb-2" />
                        <div className="h-4 w-60 bg-slate-800 rounded" />
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4 mb-10">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-slate-800 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
