"use client"
import { useContext } from "react";
import { AppStateContext } from "./StateProvider";
import Link from "next/link";

export default function Page() {
    const context = useContext(AppStateContext);

    if (!context) {
        return <div>Loading...</div>;
    }

    const { setIsPartnerModalOpen } = context;

    return (
        <div className="relative overflow-hidden">
            <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px]" />

            <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/30 mb-6 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                    </span>
                    <span className="text-xs font-medium text-indigo-200 tracking-wide uppercase">The Kingdom Creative Economy</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight">
                    The Digital Sanctuary <br />
                    for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Kingdom Creatives</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10">
                    A Human-Verified marketplace for worship pads, sermon visuals, and creative services.
                    Theologically safe. Spirit-led excellence.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                        href="/marketplace"
                        className="px-8 py-4 bg-white text-slate-950 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
                    >
                        Browse Market
                    </Link>
                    <button
                        onClick={() => setIsPartnerModalOpen(true)}
                        className="px-8 py-4 bg-slate-900/50 text-white border border-white/10 rounded-xl font-bold text-lg hover:bg-slate-800 transition-colors backdrop-blur-md"
                    >
                        Become a Partner
                    </button>
                </div>

                <div className="mt-16 flex items-center justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <span className="text-xl font-black font-serif">Electronic Worship</span>
                    <span className="text-xl font-bold tracking-tighter">The Sunday Team</span>
                    <span className="text-xl font-medium tracking-wide">HILLSONG</span>
                    <span className="text-xl font-bold font-mono">BETHEL</span>
                </div>
            </div>
        </div>
    )
}
