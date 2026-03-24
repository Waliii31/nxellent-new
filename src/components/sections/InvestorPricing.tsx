// src/components/sections/InvestorPricing.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";
import ScrollReveal from "../animations/ScrollReveal";
import { useCreateSubscriptionCheckout } from "../../hooks/api/useBilling";
import { useCurrentUser } from "../../hooks/api/useAuth";

/** ---------- Types ---------- */
type InvestorPlanKey = "basic" | "pro" | "enterprise";

type InvestorPlan = {
  key: InvestorPlanKey;
  title: string;
  priceLabel: string; // "$499" | "$1,499" | "Custom"
  cadence: string;    // "Per Month" | "$3k – $10k Per Month"
  blurb: string;
  features: string[];
  cta: string;
  filled?: boolean;
};

type CardProps = Omit<InvestorPlan, "key">;

type InvestorPricingProps = {
  className?: string;
};

/** ---------- Data ---------- */
const plans: InvestorPlan[] = [
  {
    key: "basic",
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
    cta: "Subscribe",
  },
  {
    key: "pro",
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
    cta: "Request Demo",
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
    cta: "Contact Sales",
    filled: true,
  },
];

/** ---------- Card (pricing only – no Stripe) ---------- */
const Card: React.FC<CardProps> = ({
  title,
  priceLabel,
  cadence,
  blurb,
  features,
  cta,
  filled,
}) => {
  const navigate = useNavigate();

  const { data: user } = useCurrentUser();
  const createCheckout = useCreateSubscriptionCheckout();
  const [submitting, setSubmitting] = useState(false);

  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    filled ? (
      <div className="rounded-3xl relative p-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
        {children}
      </div>
    ) : (
      <div className="rounded-3xl relative pb-0.5 bg-[linear-gradient(135deg,#D467B9_0%,#5FA8FF_100%)] h-full">
        {children}
      </div>
    );

  const startCheckout = async () => {
    if (!user) {
      navigate("/auth/signup");
      return;
    }

    const planId = title === "Enterprise"
      ? "enterprise"
      : title.toLowerCase().replace(/\s+/g, '-');

    try {
      setSubmitting(true);
      const res = await createCheckout.mutateAsync({
        planId,
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
        <div
          className="rounded-3xl bg-[#07051A] text-white px-8 pt-12 pb-8
                     shadow-[inset_0_0_0_9999px_rgba(255,255,255,0.02)]
                     flex flex-col h-full min-h-[560px] overflow-hidden"
        >
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

          {/* CTA pinned bottom – just navigates to billing */}
          <div className="mt-auto">
            {filled ? (
              <PrimaryButton moreClasses="w-full" onClick={startCheckout} disabled={submitting}>
                {submitting ? "Redirecting..." : cta}
              </PrimaryButton>
            ) : (
              <SecondaryButton moreClasses="w-full" onClick={startCheckout} disabled={submitting}>
                {submitting ? "Redirecting..." : cta}
              </SecondaryButton>
            )}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

/** ---------- Main Component (pricing only) ---------- */
const InvestorPricing: React.FC<InvestorPricingProps> = ({ className = "" }) => {
  return (
    <section
      id="investor-plans"
      className={`w-full text-white py-20 ${className}`}
    >
      <ScrollReveal className="space-y-10">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="anybody text-4xl md:text-5xl font-semibold leading-tight">
            For Investors
          </h2>
          <p className="alexandria mt-3 text-white/70">
            Independent risk metrics for portfolio and dealflow.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map(({ key, ...rest }) => (
            <Card key={key} {...rest} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
};

export default InvestorPricing;
