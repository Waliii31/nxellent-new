// src/components/tabs-content/Accounts-billing-tabs-content/Subscription.tsx
import { useMemo } from "react";
import toast from "react-hot-toast";
import {
  useSubscriptionStatus,
  useSubscriptionCancel,
} from "../../../hooks/api/useSubscription";
import FoundersBillingPlans from "../../sections/FoundersBillingPlans";
import InvestorBillingPlans from "../../sections/InvestorBillingPlans";

type BillingType = "founder" | "investor";

const formatDate = (value?: string) => {
  if (!value) return "—";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatPlanName = (plan?: string) => {
  if (!plan) return "—";
  const planName = plan.charAt(0).toUpperCase() + plan.slice(1).toLowerCase();
  return `${planName} Plan`;
};

type SubscriptionProps = {
  billingType?: BillingType; // comes from AccountsAndBilling via route state
};

const Subscription: React.FC<SubscriptionProps> = ({ billingType = "founder" }) => {
  const { data, isLoading, isError } = useSubscriptionStatus();
  const { mutate: cancelSubscription, isPending: isCancelling } =
    useSubscriptionCancel();

  const handleCancelSubscription = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel your subscription? You will lose access to premium features at the end of your billing period."
      )
    ) {
      cancelSubscription(undefined, {
        onSuccess: () => {
          toast.success("Subscription cancelled successfully");
        },
        onError: () => {
          toast.error("Failed to cancel subscription");
        },
      });
    }
  };

  const usage = useMemo(() => {
    const total = data?.totalScans ?? 0;
    const remaining = data?.remainingScans ?? 0;
    const used = Math.max(0, total - remaining);
    return { total, remaining, used };
  }, [data]);

  const planName = formatPlanName(data?.plan);


  // you can later map founder/investor plan keys from backend if/when you need them:
  // const selectedPlanKey = useMemo(() => {
  //   const key = (data?.plan || "").toLowerCase();
  //   return key === "free" || key === "starter" || key === "pro"
  //     ? (key as "free" | "starter" | "pro")
  //     : undefined;
  // }, [data?.plan]);
  //
  // const investorSelectedKey = useMemo(() => {
  //   const raw = (data as any)?.investorPlan;
  //   const key = (raw || "").toLowerCase();
  //   return key === "basic" || key === "pro" || key === "enterprise"
  //     ? (key as "basic" | "pro" | "enterprise")
  //     : undefined;
  // }, [data]);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 flex flex-col justify-center items-center">
      <div
        className="w-full rounded-2xl border border-[#2A2355] bg-[#000124] shadow-[0_0_40px_0_#A855F733] relative overflow-hidden p-5 sm:p-8 md:p-12 col-span-full lg:col-span-2"
        style={{
          borderTop: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
        }}
      >
        <span className="urbanist flex items-center text-2xl sm:text-3xl gap-2 mb-2 sm:mb-3 font-medium text-white">
          <img
            src="/king.svg"
            alt="King Icon"
            className="w-5 h-5 sm:w-6 sm:h-6"
          />{" "}
          Current Plan
        </span>

        <p className="alexandria inter text-sm sm:text-md font-medium text-white/80">
          {isLoading
            ? "Loading subscription details…"
            : isError
              ? "Unable to load subscription right now."
              : "Your active subscription details"}
        </p>

        <div className="flex flex-col sm:flex-row mt-4 justify-between items-start sm:items-center gap-3">
          <div>
            <span className="urbanist text-3xl sm:text-4xl font-extrabold text-white">
              {planName}
            </span>
            <p className="alexandria inter text-white/80 text-base sm:text-lg font-medium my-1">
              {(() => {
                const plan = data?.plan?.toLowerCase();
                if (plan === "pro") return "Unlimited scans / cycle";
                if (plan === "starter") return "3 scans / month";
                if (plan === "free") return "1 public scan";
                if (data?.totalScans && data.totalScans > 0) {
                  return `${data.totalScans} scans / cycle`;
                }
                return "Contact support for usage details";
              })()}
            </p>
            <p className="alexandria inter text-white/80 text-base sm:text-lg font-medium my-1">
              {data?.cancelAtPeriodEnd
                ? `Expires on: ${formatDate(data.cancelAtPeriodEnd)}`
                : `Next billing: ${data?.renewsAt ? formatDate(data.renewsAt) : "Not scheduled"
                }`}
            </p>
          </div>
          <button className="jakarta bg-[#FD7EFF] text-[#090123] font-semibold text-xs sm:text-sm py-2 px-4 rounded-full self-start sm:self-auto">
            {isLoading
              ? "Checking…"
              : !data
                ? "Unavailable"
                : data.cancelAtPeriodEnd
                  ? "Expiring"
                  : data.status.charAt(0).toUpperCase() + data.status.slice(1)}
          </button>
        </div>



        <hr className="h-0.5 my-4 w-full border-0 bg-linear-to-r from-[#BE0178] to-[#E830E8]" />

        <div className="flex justify-between items-center">
          <p className="alexandria inter text-white/80 text-sm sm:text-lg font-medium my-1">
            Scans used this cycle
          </p>
          <p className="alexandria inter text-white/80 text-sm sm:text-lg font-medium my-1">
            {isLoading ? "…" : data?.plan?.toLowerCase() === "pro" ? "∞" : usage.used}
          </p>
        </div>
        <div className="flex justify-between items-center">
          <p className="alexandria inter text-white/80 text-sm sm:text-lg font-medium my-1">
            Remaining scans
          </p>
          <p className="alexandria inter text-white/80 text-sm sm:text-lg font-medium my-1">
            {isLoading ? "…" : data?.plan?.toLowerCase() === "pro" ? "Unlimited" : usage.remaining}
          </p>
        </div>

        {data?.plan &&
          data.plan !== "free" &&
          data.status === "active" &&
          !data.cancelAtPeriodEnd && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleCancelSubscription}
                disabled={isCancelling}
                className="text-red-400 text-sm hover:text-red-300 transition-colors disabled:opacity-50 underline decoration-red-400/50 hover:decoration-red-300"
              >
                {isCancelling ? "Cancelling..." : "Cancel Subscription"}
              </button>
            </div>
          )}
      </div>

      {/* ↓↓↓ Billing grids ↓↓↓ */}
      {billingType === "investor" ? (
        <InvestorBillingPlans className="mt-10" />
        // once you have investor plan in backend, pass selectedKey here:
        // <InvestorBillingPlans className="mt-10" selectedKey={investorSelectedKey} />
      ) : (
        <FoundersBillingPlans className="mt-10" />
        // if your FoundersBillingPlans supports selectedKey, you can pass selectedPlanKey
        // <FoundersBillingPlans className="mt-10" selectedKey={selectedPlanKey} />
      )}
    </div>
  );
};

export default Subscription;
