// src/pages/BillingCancel.tsx
import React from "react";
import { Link } from "react-router-dom";
import { XCircle, ArrowLeft } from "lucide-react";
import PrimaryButton from "../components/ui/PrimaryButton";
import Navbar from "../components/sections/Navbar";

const BillingCancel: React.FC = () => {
    return (
        <main
            style={{
                background: "url(/auth-page.png)",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
            }}
            className="min-h-screen text-white flex items-center justify-center px-4"
        >
            <Navbar isFixed={true} />
            <div className="max-w-2xl w-full mb-20 mt-32">
                {/* Cancel Card */}
                <div
                    className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)]"
                >
                    <div className="rounded-3xl bg-[#07051A] px-8 py-12 md:px-12 md:py-16 text-center">
                        {/* Cancel Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#D467B9] blur-2xl opacity-50 rounded-full"></div>
                                <XCircle
                                    size={80}
                                    className="text-[#D467B9] relative z-10"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="anybody text-3xl md:text-4xl font-bold mb-4">
                            Payment Cancelled
                        </h1>

                        {/* Description */}
                        <p className="urbanist text-lg text-white/80 mb-2">
                            Your payment was cancelled and no charges were made.
                        </p>
                        <p className="urbanist text-base text-white/60 mb-8">
                            You can try again anytime or explore our free plan features.
                        </p>

                        {/* Info Section */}
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <h2 className="anybody text-xl font-semibold mb-4">
                                Why Choose a Paid Plan?
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Unlimited scans and priority processing
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Advanced vulnerability analysis and reports
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Priority support and custom features
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/projects/accounts-and-billing">
                                <PrimaryButton moreClasses="w-full sm:w-auto">
                                    Try Again
                                </PrimaryButton>
                            </Link>
                            <Link to="/pricing">
                                <button className="px-10 py-4 rounded-[58px] border border-[#FFC2C8] text-[#FFC2C8] text-sm font-medium transition-all duration-300 hover:bg-[#FFC2C8]/10 w-full sm:w-auto">
                                    View Pricing
                                </button>
                            </Link>
                        </div>

                        {/* Back Link */}
                        <Link
                            to="/projects/my-projects"
                            className="inline-flex items-center gap-2 mt-8 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={16} />
                            <span className="urbanist text-sm">Back to Dashboard</span>
                        </Link>
                    </div>
                </div>

                {/* Support Link */}
                <p className="text-center mt-6 text-white/60 text-sm urbanist">
                    Have questions?{" "}
                    <Link to="/" className="text-[#FFC2C8] hover:underline">
                        Contact Support
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default BillingCancel;
