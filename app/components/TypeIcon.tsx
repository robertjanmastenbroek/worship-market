"use client"
import { Music, Mic2, FileText, Star } from 'lucide-react';

export const TypeIcon = ({ type, className = "" }: { type: string, className?: string }) => {
    switch (type) {
        case 'service': return <Mic2 size={14} className={`text-purple-400 ${className}`} />;
        case 'asset': return <Music size={14} className={`text-blue-400 ${className}`} />;
        case 'knowledge': return <FileText size={14} className={`text-amber-400 ${className}`} />;
        default: return <Star size={14} className={className} />;
    }
};
