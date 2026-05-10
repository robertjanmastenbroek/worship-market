"use client";

import { useContext } from 'react';
import { AppStateContext } from '../StateProvider';
import AuthModal from '../AuthModal';
import { CartDrawer } from './CartDrawer';
import { CreateListingModal } from './CreateListingModal';
import Modal from '../Modal';

export function ModalsWrapper() {
    const context = useContext(AppStateContext);

    if (!context) {
        return null;
    }

    const {
        isAuthModalOpen,
        setIsAuthModalOpen,
        isCartOpen,
        setIsCartOpen,
        cart,
        removeFromCart,
        handleCheckoutSuccess,
        isListingModalOpen,
        setIsListingModalOpen,
        handlePublishListing,
        user,
        setUser,
        selectedProduct,
        setSelectedProduct,
        activeChatOrder,
        setActiveChatOrder,
        isPartnerModalOpen,
        setIsPartnerModalOpen,
        hasAgreedToCreed,
        setHasAgreedToCreed,
        view,
        setView
    } = context;

    return (
        <>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onAuthSuccess={setUser}
            />
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cart={cart}
                removeFromCart={removeFromCart}
                onCheckout={() => {
                    setIsCartOpen(false);
                    handleCheckoutSuccess();
                }}
            />
            <CreateListingModal
                isOpen={isListingModalOpen}
                onClose={() => setIsListingModalOpen(false)}
                onPublish={handlePublishListing}
            />
            {selectedProduct && (
                <Modal
                    isOpen={!!selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    title={selectedProduct.title}
                >
                    <div className="space-y-4">
                        <p className="text-slate-300">{selectedProduct.description}</p>
                        <button
                            onClick={() => {
                                // Add to cart logic would go here
                                setSelectedProduct(null);
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-2 rounded"
                        >
                            Add to Cart
                        </button>
                    </div>
                </Modal>
            )}
            {isPartnerModalOpen && (
                <Modal
                    isOpen={isPartnerModalOpen}
                    onClose={() => setIsPartnerModalOpen(false)}
                    title="Become a Partner"
                >
                    <div className="space-y-5">
                        <div className="bg-indigo-900/20 border border-indigo-500/30 rounded-xl p-4">
                            <p className="text-sm text-slate-300 leading-relaxed">
                                As a WorshipMarket Partner, you can sell worship pads, sermon visuals, mixing services, and creative resources to churches worldwide. All partners are theologically vetted.
                            </p>
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span className="text-slate-300">Set your own prices — you keep 85% of every sale</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span className="text-slate-300">Instant payouts via Stripe Connect</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span className="text-slate-300">Built-in workroom chat with buyers</span>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="text-emerald-400 mt-0.5">✓</span>
                                <span className="text-slate-300">Verified Partner badge on all your listings</span>
                            </div>
                        </div>

                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
                            <p className="text-sm text-amber-300 leading-relaxed">
                                <strong>Important:</strong> All content must align with orthodox Christian theology (Nicene Creed). Selling heretical, plagiarized, or AI-generated sermon content is prohibited and will result in an immediate ban.
                            </p>
                        </div>

                        <label className="flex items-start gap-3 p-3 bg-slate-800/50 border border-white/5 rounded-xl cursor-pointer hover:border-white/10 transition-colors">
                            <input
                                type="checkbox"
                                checked={hasAgreedToCreed}
                                onChange={(e) => setHasAgreedToCreed(e.target.checked)}
                                className="mt-0.5 accent-emerald-500"
                            />
                            <span className="text-xs text-slate-400 leading-relaxed">
                                I have read and agree to the{' '}
                                <a href="/CONSTITUTION.md" target="_blank" className="text-indigo-400 hover:text-indigo-300 underline">Statement of Faith</a>
                                . I affirm that all content I sell will be theologically sound and I own full copyright.
                            </span>
                        </label>

                        <button
                            onClick={() => {
                                if (hasAgreedToCreed) {
                                    // Redirect to signup if not logged in
                                    if (!user) {
                                        setIsPartnerModalOpen(false);
                                        setIsAuthModalOpen(true);
                                        return;
                                    }
                                    setView('dashboard');
                                    setIsPartnerModalOpen(false);
                                }
                            }}
                            disabled={!hasAgreedToCreed}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                        >
                            {user ? 'Go to Partner Dashboard' : 'Sign Up as Partner'}
                        </button>

                        {!user && (
                            <p className="text-center text-xs text-slate-500">
                                Already a partner?{' '}
                                <button onClick={() => { setIsPartnerModalOpen(false); setIsAuthModalOpen(true); }} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                                    Sign In
                                </button>
                            </p>
                        )}
                    </div>
                </Modal>
            )}
        </>
    );
}
