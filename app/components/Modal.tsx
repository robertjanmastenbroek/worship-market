"use client"
import React from "react";
import { X } from "lucide-react";

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title?: string, children: React.ReactNode }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-slate-900 rounded-xl shadow-2xl border border-white/10 w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col relative">
                <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-white/10 flex-shrink-0">
                    <h3 className="text-lg font-bold text-white">{title}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20} className="text-slate-400" />
                    </button>
                </div>
                <div className="overflow-y-auto p-4 md:p-6 flex-1">{children}</div>
            </div>
        </div>
    );
};
