"use client";

import { ShoppingBag, X, CreditCard, Lock } from 'lucide-react';

export const CartDrawer = ({ isOpen, onClose, cart, removeFromCart, onCheckout }: any) => {
    const total = cart.reduce((sum: number, item: any) => sum + item.price, 0);
  
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity" onClick={onClose} />
        )}
        <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-white/10 z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="h-full flex flex-col">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-slate-900">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <ShoppingBag className="text-indigo-400" /> Your Cart
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
  
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-600">
                    <ShoppingBag size={32} />
                  </div>
                  <p className="text-slate-400">Your cart is empty.</p>
                  <p className="text-sm text-slate-500 mt-2">Go find some holy fire for Sunday.</p>
                </div>
              ) : (
                cart.map((item: any, idx: number) => (
                  <div key={`${item.id}-${idx}`} className="flex gap-4 p-3 rounded-lg bg-white/5 border border-white/5">
                    <img src={item.image} className="w-16 h-16 rounded-md object-cover bg-slate-800" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-white line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 capitalize">{item.type} • {item.author}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold text-indigo-400">${item.price}</span>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-xs text-red-400 hover:text-red-300 hover:underline"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
  
            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-slate-900">
                <div className="flex justify-between mb-4 text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-6 text-white font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition-all"
                >
                  <CreditCard size={18} /> Proceed to Checkout
                </button>
                <p className="text-center text-[10px] text-slate-500 mt-3 flex items-center justify-center gap-1">
                  <Lock size={10} /> Secure payment via Stripe
                </p>
              </div>
            )}
          </div>
          </div>
        </>
      );
    }
