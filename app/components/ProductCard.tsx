"use client";

import { Play, Pause, ShieldCheck, Music, Mic2, FileText, Star } from 'lucide-react';

// --- PRODUCT CARD COMPONENT ---
export const ProductCard = ({ product, onPlay, isPlaying, onAddToCart, onClick }: {
  product: any,
  onPlay: (product: any) => void,
  isPlaying: boolean,
  onAddToCart: (product: any) => void,
  onClick: (product: any) => void
}) => {
  return (
    <div className="bg-slate-900 rounded-xl border border-white/10 shadow-lg hover:shadow-indigo-500/10 transition-shadow overflow-hidden group cursor-pointer flex flex-col" onClick={() => onClick(product)}>
      <div className="relative h-40 w-full overflow-hidden">
        <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        {product.type === 'asset' && product.audioUrl && (
          <button
            onClick={e => { e.stopPropagation(); onPlay(product); }}
            className="absolute bottom-2 right-2 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 hover:scale-110 transition-transform"
          >
            {isPlaying ? <Pause fill="white" size={20} /> : <Play fill="white" size={20} className="ml-0.5" />}
          </button>
        )}
      </div>
      <div className="flex-1 flex flex-col p-4 gap-2">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <TypeIcon type={product.type} />
          <span className="font-bold text-indigo-400">{product.category}</span>
        </div>
        <h3 className="font-bold text-white text-base line-clamp-1">{product.title}</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>By {product.author}</span>
          <Badge verified={product.authorVerified} />
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-bold text-indigo-400">${product.price}</span>
          {product.rating && (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Star size={12} /> {product.rating.toFixed(1)}
            </span>
          )}
          {product.reviews > 0 && (
            <span className="text-xs text-slate-500">({product.reviews})</span>
          )}
        </div>
        <p className="text-xs text-slate-400 line-clamp-2 flex-1">{product.description}</p>
        <div className="flex gap-2 flex-wrap mt-2">
          {product.tags && product.tags.map((tag: string) => (
            <span key={tag} className="bg-indigo-900/40 text-indigo-300 text-[10px] px-2 py-0.5 rounded-full font-bold">{tag}</span>
          ))}
        </div>
        <button
          onClick={e => { e.stopPropagation(); onAddToCart(product); }}
          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};
const Badge = ({ verified }: { verified: boolean }) => {
  if (!verified) return null;
  return (
    <div className="flex items-center gap-1 text-[10px] font-bold tracking-wider text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-500/30">
      <ShieldCheck size={10} /> VERIFIED PARTNER
    </div>
  );
};


const TypeIcon = ({ type, className = "" }: { type: string, className?: string }) => {
  switch (type) {
    case 'service': return <Mic2 size={14} className={`text-purple-400 ${className}`} />;
    case 'asset': return <Music size={14} className={`text-blue-400 ${className}`} />;
    case 'knowledge': return <FileText size={14} className={`text-amber-400 ${className}`} />;
    default: return <Star size={14} className={className} />;
  }
};
