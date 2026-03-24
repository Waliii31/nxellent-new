// src/components/sections/InvestorBillingPlans.tsx
import React, { useState } from "react";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ScrollReveal from "../animations/ScrollReveal";
import { useCreateSubscriptionCheckout } from "../../hooks/api/useBilling";

/** ---------- Types & Data ---------- */
type InvestorPlanKey = "investor-basic" | "investor-pro" | "enterprise";

type InvestorPlan = {
    key: InvestorPlanKey;
    title: string;
    priceLabel: string;
    cadence: string;
    blurb: string;
    features: string[];
    filled?: boolean;
};

type BillingCardProps = InvestorPlan & {
    planKey: InvestorPlanKey;
    isSelected: boolean;
};

type InvestorBillingPlansProps = {
    className?: string;
    selectedKey?: InvestorPlanKey; // optional – for future if you store investor plan in backend
};

const plans: InvestorPlan[] = [
    {
        key: "investor-basic",
        title: "Investor Basic",
        priceLabel: "$499",
        cadence: "Per Month",
        blurb:
            "Full leaderboard data • Investor dashboard • Batch scanning (10 projects/mo)",
        features: [
            "Full leadership access",
            "Batch scanning (10 projects/mo)",
            "Basic analytics",
            "Investor dashboard",
            "Portfolio overview",
            "Dedicated support",
        ],
    },
    {
        key: "investor-pro",
        title: "Investor Pro",
        priceLabel: "$1,499",
        cadence: "Per Month",
        blurb:
            "Unlimited scans • Portfolio dashboard with alerts • Bulk export • API access",
        features: [
            "Unlimited project scans",
            "Bulk export (CSV/PDF)",
            "Advanced analytics",
            "Priority support",
            "Portfolio dashboard with alerts",
            "Full API access",
            "Risk monitoring alerts",
            "Custom reporting",
        ],
    },
    {
        key: "enterprise",
        title: "Enterprise",
        priceLabel: "Custom",
        cadence: "$3k – $10k Per Month",
        blurb:
            "White-label dashboard • Unlimited scans • Dedicated support + compliance",
        features: [
            "White-label dashboard",
            "Dedicated support team",
            "Custom integrations",
            "On-premise options",
            "Unlimited scans",
            "Compliance options",
            "SLA guarantees",
            "Training & onboarding",
        ],
        filled: true,
    },
];

/** center selected in the middle – default to "pro" if we don't know */
function orderForBilling(selectedKey?: InvestorPlanKey): InvestorPlan[] {
    const fallbackKey: InvestorPlanKey = "investor-pro";
    const key = selectedKey ?? fallbackKey;
    const sel = plans.find((p) => p.key === key) ?? plans[1];
    const others = plans.filter((p) => p.key !== sel.key);
    return [others[0], sel, others[1]];
}

/** ---------- Card ---------- */
const BillingCard: React.FC<BillingCardProps> = ({
    planKey,
    title,
    priceLabel,
    cadence,
    blurb,
    features,
    filled,
    isSelected,
}) => {
    const createCheckout = useCreateSubscriptionCheckout();
    const [submitting, setSubmitting] = useState(false);

    // Map plan keys to backend enum values
    const planId = planKey === "enterprise"
        ? "enterprise"
        : planKey === "investor-pro"
            ? "investor-pro"
            : "investor-basic";

    const startCheckout = async () => {
        if (isSelected) return;
        try {
            setSubmitting(true);
            const res = await createCheckout.mutateAsync({
                planId,
                successUrl: `${window.location.origin}/billing/success?type=subscription&plan=${planId}`,
                cancelUrl: `${window.location.origin}/billing/cancel`,
            });
            if (res?.checkoutUrl) {
                window.location.href = res.checkoutUrl;
            } else {
                alert("Failed to create checkout session. Please try again.");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string; error?: string } } };
            const errorMessage = err?.response?.data?.message || err?.response?.data?.error || "Unknown error";
            alert(`Failed to create checkout session: ${errorMessage}\n\nPlease contact support if this persists.`);
        } finally {
            setSubmitting(false);
        }
    };

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
        isSelected || filled ? (
            <div className="rounded-3xl relative p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        ) : (
            <div className="rounded-3xl relative pb-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        );

    return (
        <div className="h-full relative">
            <Wrapper>
                <div
                    className="rounded-3xl bg-[#07051A] text-white px-8 pt-12 pb-8
                     shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)]
                     flex flex-col h-full min-h-[560px] overflow-hidden"
                >
                    {/* Badge only when we know it's current */}
                    {isSelected && (
                        <div className="absolute w-full left-0 -top-4.5 flex justify-center text-center">
                            <span className="px-4 py-2 rounded-full text-sm font-medium text-white bg-linear-to-b from-[#DF46F2] to-[#A501FF]">
                                Current Plan
                            </span>
                        </div>
                    )}

                    {/* Title */}
                    <span className="urbanist text-2xl font-light">{title}</span>

                    {/* Price row */}
                    <div className="mt-4 mb-5 flex items-end gap-3">
                        <span className="urbanist text-4xl font-bold">{priceLabel}</span>
                        <span className="urbanist text-base text-white/70 mb-2">
                            {cadence}
                        </span>
                    </div>

                    {/* Blurb */}
                    <p className="alexandria text-white/80 leading-relaxed mb-6">{blurb}</p>

                    {/* Features */}
                    <ul className="space-y-4 mb-10">
                        {features.map((f, i) => (
                            <li
                                key={`${title}-feat-${i}`}
                                className="flex items-start gap-3 text-[15px] text-white/85"
                            >
                                <span className="urbanist mt-0.5">
                                    <img src="/check.svg" alt="" />
                                </span>
                                <span>{f}</span>
                            </li>
                        ))}
                    </ul>

                    {/* CTA pinned bottom */}
                    <div className="mt-auto">
                        {isSelected ? (
                            <PrimaryButton moreClasses="w-full" disabled>
                                Current Plan
                            </PrimaryButton>
                        ) : filled ? (
                            <PrimaryButton
                                moreClasses="w-full"
                                disabled={submitting}
                                onClick={startCheckout}
                            >
                                {submitting ? "Redirecting…" : "Contact Sales"}
                            </PrimaryButton>
                        ) : (
                            <SecondaryButton
                                moreClasses="w-full"
                                disabled={submitting}
                                onClick={startCheckout}
                            >
                                {submitting ? "Redirecting…" : "Upgrade"}
                            </SecondaryButton>
                        )}
                    </div>
                </div>
            </Wrapper>
        </div>
    );
};

/** ---------- Main billing component ---------- */
const InvestorBillingPlans: React.FC<InvestorBillingPlansProps> = ({
    className = "",
    selectedKey,
}) => {
    // TODO: once you have investor subscription in backend,
    // pass the real selectedKey to highlight the current plan.
    const ordered = orderForBilling(selectedKey);

    return (
        <section className={`w-full text-white py-12 ${className}`}>
            <ScrollReveal className="space-y-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="anybody text-3xl md:text-4xl font-semibold leading-tight">
                        Investor Plans
                    </h2>
                    <p className="alexandria mt-2 text-white/70">
                        Upgrade your investor access via secure checkout.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {ordered.map(({ key, ...rest }) => (
                        <BillingCard
                            key={key}
                            planKey={key}
                            {...rest}
                            isSelected={selectedKey ? key === selectedKey : false}
                        />
                    ))}
                </div>
            </ScrollReveal>
        </section>
    );
};

export default InvestorBillingPlans;
