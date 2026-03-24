import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ScrollReveal from "../animations/ScrollReveal";
import { useCreateSubscriptionCheckout } from "../../hooks/api/useBilling";
import { useCurrentUser } from "../../hooks/api/useAuth";

type PlanKey = "free" | "starter" | "pro";

type Plan = {
    key: PlanKey;
    title: string;
    price: string;
    cadence: string;
    icon: string;
    features: string[];
    cta: string;
    filledBtn: boolean;
    popular?: boolean;
};

type CardProps = Omit<Plan, "cta" | "key"> & {
    cta: string;
};

type FoundersPricingProps = {
    className?: string;
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
        cta: "Run Free Scan",
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
        cta: "Upgrade to Starter",
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
        cta: "Go Pro",
        filledBtn: true,
        popular: true,
    },
];

const Card: React.FC<CardProps> = ({
    title,
    price,
    cadence,
    icon,
    features,
    filledBtn,
    cta,
    popular,
}) => {
    const navigate = useNavigate();

    const { data: user } = useCurrentUser();
    const createCheckout = useCreateSubscriptionCheckout();
    const [submitting, setSubmitting] = useState(false);

    const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
        popular ? (
            <div className="rounded-3xl p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        ) : (
            <div className="rounded-3xl pb-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
                {children}
            </div>
        );

    const handleClick = async () => {
        if (!user) {
            navigate("/auth/signup");
            return;
        }

        const planId = title.toLowerCase();

        if (planId === "free") {
            navigate("/projects/my-projects");
            return;
        }

        try {
            setSubmitting(true);
            const res = await createCheckout.mutateAsync({
                planId: planId, // "starter" or "pro"
                successUrl: `${window.location.origin}/billing/success?type=subscription&plan=${planId}`,
                cancelUrl: `${window.location.origin}/pricing`,
            });
            if (res?.checkoutUrl) {
                window.location.href = res.checkoutUrl;
            } else {
                alert("Failed to create checkout session. Please try again.");
            }
        } catch (error: unknown) {
            const err = error as { response?: { data?: { message?: string } } };
            const errorMessage = err?.response?.data?.message || "Unknown error";
            alert(`Failed to initiate checkout: ${errorMessage}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="h-full relative">
            <Wrapper>
                <div className="rounded-3xl bg-[#07051A] text-white px-8 pt-14 pb-8 shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)] flex flex-col h-full min-h-[560px] overflow-hidden">
                    {/* Top badge */}
                    {popular && (
                        <div className="absolute w-full left-0 -top-4.5 flex justify-center text-center">
                            <span
                                className="px-4 py-2 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] rounded-full text-sm font-medium jakarta text-white"
                            >
                                Most Popular
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

                    {/* CTA pinned to bottom – just navigates, no Stripe */}
                    <div className="mt-auto">
                        {filledBtn ? (
                            <PrimaryButton moreClasses="w-full" onClick={handleClick} disabled={submitting}>
                                {submitting ? "Redirecting..." : cta || "Go Pro"}
                            </PrimaryButton>
                        ) : (
                            <SecondaryButton moreClasses="w-full" onClick={handleClick} disabled={submitting}>
                                {submitting ? "Redirecting..." : cta || "Upgrade"}
                            </SecondaryButton>
                        )}
                    </div>
                </div>
            </Wrapper>
        </div>
    );
};

const FoundersPricing: React.FC<FoundersPricingProps> = ({ className = "" }) => {
    return (
        <section className={`w-full z-0 text-white py-20 ${className}`}>
            <ScrollReveal className="space-y-10">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="anybody text-4xl md:text-5xl font-semibold leading-tight">
                        For Founders
                    </h2>
                    <p className="alexandria mt-3 text-white/70">
                        Demonstrate trust before investors ask.
                    </p>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                    {plans.map((p) => (
                        <Card
                            key={p.key}
                            title={p.title}
                            price={p.price}
                            cadence={p.cadence}
                            icon={p.icon}
                            features={p.features}
                            filledBtn={p.filledBtn}
                            cta={p.cta}
                            popular={p.popular}
                        />
                    ))}
                </div>
            </ScrollReveal>
        </section>
    );
};

export default FoundersPricing;
