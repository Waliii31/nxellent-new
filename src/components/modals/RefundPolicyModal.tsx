import React from "react";
import { X } from "lucide-react";

type RefundPolicyModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

const RefundPolicyModal: React.FC<RefundPolicyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div
                className="relative w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Card with Gradient Border */}
                <div className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] flex flex-col h-full overflow-hidden">
                    <div className="rounded-3xl bg-[#07051A] px-6 py-8 shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)] flex flex-col h-full overflow-hidden relative">
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors z-10"
                        >
                            <X size={18} className="text-white/70" />
                        </button>

                        {/* Title */}
                        <h2 className="anybody text-2xl font-bold text-white mb-6 flex-shrink-0">
                            Refund and Cancellation Policy
                        </h2>

                        {/* Scrollable Content */}
                        <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow space-y-6 text-white/80 font-light text-[15px] leading-relaxed">
                            <p className="border-b border-white/10 pb-4">
                                <strong className="text-white">Last Updated: January 2026</strong>
                            </p>

                            <p>
                                Thank you for choosing <strong className="text-white">NXELLENT</strong>. Because our platform provides immediate access to digital security assets, reports, and proprietary data, we maintain a strict <strong className="text-white">no-refund</strong> policy.
                            </p>

                            <section>
                                <h3 className="text-white font-semibold text-lg mb-2">1. "Try Before You Buy" (Free Scan)</h3>
                                <p>
                                    To ensure that NXELLENT meets your needs and technical requirements, we provide <strong className="text-white">one (1) free public scan</strong> to every user. We strongly encourage all users to utilize this free scan to evaluate the platform and its output before making any financial commitment.
                                </p>
                            </section>

                            <section>
                                <h3 className="text-white font-semibold text-lg mb-2">2. No Refunds</h3>
                                <p className="mb-2"><strong className="text-white">All sales are final.</strong> By making a purchase, you acknowledge that you have had the opportunity to test the platform via the free scan. We do not offer refunds or credits for:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong className="text-white">One-Time Scans:</strong> The <strong className="text-white">$15.00</strong> fee for a one-time NXELLENT scan is <strong className="text-white">non-refundable</strong> once the purchase is completed.</li>
                                    <li><strong className="text-white">Subscription Plans:</strong> All payments for Founder, Investor, and Enterprise plans are final and non-refundable.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-semibold text-lg mb-2">3. Cancellations</h3>
                                <p className="mb-2">You may cancel your subscription at any time through your account dashboard.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong className="text-white">Access Duration:</strong> Upon cancellation, you will retain access to your plan’s features until the <strong className="text-white">end of your current billing period</strong>.</li>
                                    <li><strong className="text-white">No Pro-rating:</strong> We do not provide partial refunds or credits for unused time within a billing cycle.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-semibold text-lg mb-2">4. Plan Upgrades and Downgrades</h3>
                                <p className="mb-2">Changes to your subscription tier (upgrading or downgrading) will take effect immediately.</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li><strong className="text-white">Billing Discrepancies:</strong> Any differences in cost, credits, or prorated amounts resulting from a plan change will be calculated and applied to your <strong className="text-white">next scheduled billing statement</strong>.</li>
                                </ul>
                            </section>

                            <section>
                                <h3 className="text-white font-semibold text-lg mb-2">5. Support</h3>
                                <p>
                                    If you experience a technical error during a scan or have questions about a charge, please contact our support team at <strong className="text-white">support@nxellent.com</strong>.
                                </p>
                            </section>
                        </div>

                        <div className="pt-6 mt-2 border-t border-white/10 flex justify-end flex-shrink-0">
                            <button
                                onClick={onClose}
                                className="px-6 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicyModal;
