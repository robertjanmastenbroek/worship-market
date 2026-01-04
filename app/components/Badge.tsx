"use client"
import { ShieldCheck } from 'lucide-react';

export const Badge = ({ verified }: { verified: boolean }) => {
    if (!verified) return null;
    return (
        <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
            <ShieldCheck size={10} /> VERIFIED PARTNER
        </div>
    );
};
