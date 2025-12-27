// src/pages/BillingSuccess.tsx
import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import PrimaryButton from "../components/ui/PrimaryButton";
import Navbar from "../components/sections/Navbar";

const BillingSuccess: React.FC = () => {
    const [searchParams] = useSearchParams();
    const type = searchParams.get("type");
    const plan = searchParams.get("plan");

    const getPlanName = () => {
        if (!plan) return "Pro";
        return plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
    };

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
                {/* Success Card */}
                <div
                    className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)]"
                >
                    <div className="rounded-3xl bg-[#07051A] px-8 py-12 md:px-12 md:py-16 text-center">
                        {/* Success Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <div className="absolute inset-0 bg-[#5FA8FF] blur-2xl opacity-50 rounded-full"></div>
                                <CheckCircle2
                                    size={80}
                                    className="text-[#5FA8FF] relative z-10"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="anybody text-3xl md:text-4xl font-bold mb-4">
                            Payment Successful!
                        </h1>

                        {/* Description */}
                        <p className="urbanist text-lg text-white/80 mb-2">
                            {type === "subscription"
                                ? `You've successfully subscribed to the ${getPlanName()} plan.`
                                : "Your payment has been processed successfully."}
                        </p>
                        <p className="urbanist text-base text-white/60 mb-8">
                            A confirmation email has been sent to your registered email address.
                        </p>

                        {/* What's Next Section */}
                        <div className="bg-white/5 rounded-2xl p-6 mb-8 text-left">
                            <h2 className="anybody text-xl font-semibold mb-4">
                                What's Next?
                            </h2>
                            <ul className="space-y-3">
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Your subscription is now active and ready to use
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Access all premium features from your dashboard
                                    </span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="mt-1">
                                        <img src="/check.svg" alt="" className="w-5 h-5" />
                                    </span>
                                    <span className="urbanist text-white/80">
                                        Manage your subscription anytime from Account & Billing
                                    </span>
                                </li>
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/projects/accounts-and-billing">
                                <PrimaryButton moreClasses="w-full sm:w-auto">
                                    View Subscription
                                </PrimaryButton>
                            </Link>
                            <Link to="/projects/my-projects">
                                <button className="px-10 py-4 rounded-[58px] border border-[#FFC2C8] text-[#FFC2C8] text-sm font-medium transition-all duration-300 hover:bg-[#FFC2C8]/10 w-full sm:w-auto">
                                    Go to Dashboard
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Support Link */}
                <p className="text-center mt-6 text-white/60 text-sm urbanist">
                    Need help?{" "}
                    <Link to="/" className="text-[#FFC2C8] hover:underline">
                        Contact Support
                    </Link>
                </p>
            </div>
        </main>
    );
};

export default BillingSuccess;
