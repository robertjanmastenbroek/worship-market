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
                    title="Partner Agreement"
                >
                    <div className="space-y-4">
                        <p className="text-slate-300">
                            To become a partner, you must agree to our Statement of Faith.
                        </p>
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={hasAgreedToCreed}
                                onChange={(e) => setHasAgreedToCreed(e.target.checked)}
                            />
                            <span className="text-slate-300">I agree to the Statement of Faith</span>
                        </label>
                        <button
                            onClick={() => {
                                if (hasAgreedToCreed) {
                                    setView('dashboard');
                                    setIsPartnerModalOpen(false);
                                }
                            }}
                            disabled={!hasAgreedToCreed}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-2 rounded"
                        >
                            Become a Partner
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
}
