import React, { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ScrollReveal from "../animations/ScrollReveal";
import { useCreateSubscriptionCheckout } from "../../hooks/api/useBilling";
import { useSubscriptionStatus } from "../../hooks/api/useSubscription";

type PlanKey = "free" | "starter" | "pro";

type Plan = {
    key: PlanKey;
    title: string;
    price: string;
    cadence: string;
    icon: string;
    features: string[];
    filledBtn: boolean;
    popular?: boolean;
};

type CardProps = Omit<Plan, "popular"> & {
    isSelected: boolean;
    planKey: PlanKey;
    currentPlanKey: PlanKey;
};

const plans: Plan[] = [
    {
        key: "free",
        title: "Free",
        price: "$0",
        cadence: "forever",
        icon: "/free.png",
        features: [
            "1 Public Scan",
            "Basic Badge",
            "Appears on Leaderboard",
            "Community Support",
        ],
        filledBtn: false,
    },
    {
        key: "starter",
        title: "Starter",
        price: "$29",
        cadence: "per month",
        icon: "/starter.png",
        features: [
            "3 Scans per Month",
            "Public + Private Scans",
            "PDF Report Download",
            "Basic Vulnerability Analysis",
            "Email Support",
        ],
        filledBtn: false,
    },
    {
        key: "pro",
        title: "Pro",
        price: "$99",
        cadence: "per month",
        icon: "/pro.png",
        features: [
            "Unlimited Scans",
            "Priority Queue Processing",
            "Branded PDF Reports",
            "Verified Security Badge",
            "Advanced Vulnerability Analysis",
            "Priority Support",
            "Custom Sharing Options",
        ],
        filledBtn: true,
        popular: true,
    },
];

function orderForBilling(selectedKey: PlanKey | undefined): Plan[] {
    const sel = plans.find((p) => p.key === selectedKey) ?? plans[1]; // default to starter
    const others = plans.filter((p) => p.key !== sel.key);
    return [others[0], sel, others[1]];
}

const BillingCard: React.FC<CardProps> = ({
    title,
    price,
    cadence,
    icon,
    features,
    isSelected,
    planKey,
    currentPlanKey,
}) => {
    const createCheckout = useCreateSubscriptionCheckout();
    const [submitting, setSubmitting] = useState(false);

    const planCheckoutId = planKey;

    const startCheckout = async () => {
        if (isSelected) return;
        try {
            setSubmitting(true);
            const res = await createCheckout.mutateAsync({
                planId: planCheckoutId,
                successUrl: `${window.location.origin}/billing/success?type=subscription&plan=${planCheckoutId}`,
                cancelUrl: `${window.location.origin}/billing/cancel`,
            });
            if (res?.checkoutUrl) {
                window.location.href = res.checkoutUrl;
            } else {
                // If backend returns just the success URL directly (for free plan downgrade), redirect there
                // The backward compat fix in backend returns `checkoutUrl: successUrl` effectively if it's a redirect string
                // But better to check.
                if (typeof res === 'string') {
                    window.location.href = res;
                    return;
                }
                alert("Failed to create checkout session. Please try again.");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; error?: string } } };
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error || "Unknown error";
            alert(`Failed to update plan: ${errorMessage}\n\nPlease contact support if this persists.`);
        } finally {
            setSubmitting(false);
        }
    };

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
        isSelected ? (
            <div className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        ) : (
            <div className="rounded-3xl pb-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        );

    const renderCTA = () => {
        if (isSelected) {
            return (
                <PrimaryButton moreClasses="w-full" disabled>
                    Current Plan
                </PrimaryButton>
            );
        }

        const ranks: Record<string, number> = { free: 0, starter: 1, pro: 2 };
        const currentRank = ranks[currentPlanKey] ?? 0;
        const thisRank = ranks[planKey] ?? 0;
        const label = thisRank < currentRank ? "Downgrade" : "Upgrade";

        return (
            <SecondaryButton
                moreClasses="w-full"
                disabled={submitting}
                onClick={startCheckout}
            >
                {submitting ? "Processing…" : label}
            </SecondaryButton>
        );
    };

    return (
        <div className="h-full relative">
            <Wrapper>
                <div className="rounded-3xl bg-[#07051A] text-white px-8 pt-14 pb-8 shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)] flex flex-col h-full min-h-[560px] overflow-hidden">
                    {/* Top badge */}
                    {isSelected && (
                        <div className="absolute w-full left-0 -top-4.5 flex justify-center text-center">
                            <span className="px-4 py-2 rounded-full text-sm font-medium jakarta text-black bg-linear-to-b from-[#DF46F2] to-[#A501FF]">
                                Current Plan
                            </span>
                        </div>
                    )}

                    {/* Icon */}
                    <div className="w-full flex items-center justify-center mb-8">
                        <img src={icon} alt={title} className="w-24 h-24 object-contain" />
                    </div>

                    {/* Title + Price */}
                    <h2 className="anybody text-2xl font-medium mb-4">{title}</h2>
                    <div className="flex items-end gap-3 mb-8">
                        <span className="urbanist text-5xl font-bold">{price}</span>
                        <span className="urbanist text-base text-white/70 mb-2">
                            {cadence}
                        </span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-10">
                        {features.map((f, i) => (
                            <li
                                key={`${title}-f-${i}`}
                                className="flex items-start gap-3 text-[15px] text-white/80"
                            >
                                <span className="urbanist mt-0.5">
                                    <img src="/check.svg" alt="" />
                                </span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA pinned to bottom */}
                    <div className="mt-auto">{renderCTA()}</div>
                </div>
            </Wrapper>
        </div>
    );
};

type FoundersBillingPlansProps = {
    className?: string;
};

const FoundersBillingPlans: React.FC<FoundersBillingPlansProps> = ({
    className = "",
}) => {
    const { data: subscription } = useSubscriptionStatus();

    // assuming subscription?.plan is "free" | "starter" | "pro"
    const selectedKey = (subscription?.plan as PlanKey | undefined) ?? "free";
    const list = orderForBilling(selectedKey);

    return (
        <section className={`w-full z-0 text-white py-12 ${className}`}>
            <ScrollReveal className="space-y-8">
                {/* On billing page we normally don't need big heading, but you can keep a subtle one if you want */}
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="anybody text-3xl md:text-4xl font-semibold leading-tight">
                        Manage your plan
                    </h2>
                    <p className="alexandria mt-2 text-white/70">
                        Upgrade or downgrade your subscription. Changes are handled via
                        secure checkout.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {list.map(({ key, ...rest }) => (
                        <BillingCard
                            key={key}
                            {...rest}
                            isSelected={key === selectedKey}
                            planKey={key}
                            currentPlanKey={selectedKey}
                        />
                    ))}
                </div>

            </ScrollReveal>
        </section>
    );
};

export default FoundersBillingPlans;
