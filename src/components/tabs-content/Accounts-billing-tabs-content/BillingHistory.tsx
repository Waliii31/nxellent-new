import { Download } from "lucide-react";
import SecondaryButton from "../../ui/SecondaryButton";
import { useBillingStatus } from "../../../hooks/api/useBilling";

type InvoiceLike = {
  id?: string;
  description?: string;
  amount?: number;
  status?: string;
  date?: string;
  downloadUrl?: string;
};

const formatDate = (date?: string) => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
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

export const BillingCard = ({
  description = "Invoice",
  amount = 0,
  status = "Paid",
  date,
  downloadUrl,
}: InvoiceLike) => {
  const statusColor =
    status.toLowerCase() === "paid" ? "from-[#DF46F2] to-[#A501FF]" : "from-amber-500 to-orange-500";

  return (
    <div className="relative w-full rounded-2xl bg-[#000124] py-4 px-4 sm:px-5 md:py-[19px] md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 overflow-hidden">
      <div className="absolute bottom-0 left-0 w-full h-0.5 bg-linear-to-r from-[#3F84B9] to-[#D467B9]" />

      <div className="flex flex-col sm:flex-row justify-start sm:justify-center items-start sm:items-center gap-2 sm:gap-3 md:gap-6 w-full md:w-auto">
        <div className="min-w-0">
          <h1 className="jakarta font-medium text-sm sm:text-base text-white truncate">{description}</h1>
          <h2 className="jakarta font-medium text-xs text-white/70">{formatDate(date)}</h2>
        </div>
        <span
          className={`text-[10px] sm:text-xs font-semibold text-black px-3 py-1 rounded-full bg-linear-to-r ${statusColor}`}
        >
          {status}
        </span>
      </div>

      <div className="flex flex-wrap justify-start md:justify-center items-center gap-3 w-full md:w-auto">
        <span className="urbanist text-xl sm:text-2xl md:text-3xl font-semibold text-white">
          {amount ? `$${amount.toFixed(2)}` : "—"}
        </span>
        {downloadUrl && (
          <a href={downloadUrl} target="_blank" rel="noreferrer" className="no-underline">
            <SecondaryButton children="Download" iconPosition="left" icon={<Download size={15} />} />
          </a>
        )}
      </div>
    </div>
  );
};

const BillingHistory = () => {
  const { data, isLoading, isError } = useBillingStatus();

  // Mock invoices for now as they are not in the API yet
  const invoices: InvoiceLike[] = [
    {
      id: "inv_1",
      description: "Pro Plan Subscription",
      amount: 49.00,
      status: "Paid",
      date: new Date().toISOString(),
      downloadUrl: "#",
    }
  ];

  const remaining = data?.remainingScans ?? 0;
  const total = data?.totalScans ?? 0;
  const used = Math.max(0, total - remaining);
  const planName = formatPlanName(data?.plan);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
      <div
        className="w-full rounded-2xl border border-[#2A2355] shadow-[0_0_40px_0_#A855F733] relative overflow-hidden p-5 sm:p-8 md:p-10 lg:p-12 bg-[#000124]"
        style={{
          borderTop: "1px solid rgba(168, 85, 247, 0.2)",
          boxShadow: "rgba(168, 85, 247, 0.2) 0px 0px 40px 0px",
          background:
            "linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(168, 85, 247, 0.15) 50%, rgba(0, 0, 0, 0) 100%) rgb(0, 1, 36)",
        }}
      >
        <span className="urbanist flex flex-wrap items-center text-xl sm:text-2xl gap-2 mb-2 sm:mb-3 font-medium text-white">
          <img
            src="/card.svg"
            alt="King Icon"
            className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
          />{" "}
          Payment History
        </span>

        <p className="alexandria inter text-sm sm:text-base md:text-md font-medium text-white/80 mb-4 sm:mb-6">
          {isLoading
            ? "Loading billing details…"
            : isError
              ? "Unable to load billing data."
              : "Your invoice and payment history"}
        </p>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <span className="urbanist text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
              {planName}
            </span>
            <p className="alexandria inter text-white/80 text-sm sm:text-base md:text-lg font-medium my-1">
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
            <p className="alexandria inter text-white/80 text-sm sm:text-base md:text-lg font-medium my-1">
              Next billing: {data?.renewsAt ? formatDate(data.renewsAt) : "Not scheduled"}
            </p>
          </div>
          <button className="jakarta bg-[#FD7EFF] text-[#090123] font-semibold text-xs sm:text-sm py-2 px-4 sm:px-5 rounded-full self-start sm:self-auto">
            {isLoading ? "Checking…" : data ? "Active" : "Unavailable"}
          </button>
        </div>

        <hr className="h-0.5 my-5 sm:my-6 w-full border-0 bg-linear-to-r from-[#BE0178] to-[#E830E8]" />

        <div className="flex justify-between items-center text-white/80 text-sm sm:text-base md:text-lg font-medium">
          <p className="alexandria inter">Scans used this cycle</p>
          <p className="alexandria inter">
            {isLoading ? "…" : data?.plan?.toLowerCase() === "pro" ? "∞" : used}
          </p>
        </div>
        <div className="flex justify-between items-center text-white/80 text-sm sm:text-base md:text-lg font-medium mt-2">
          <p className="alexandria inter">Remaining scans</p>
          <p className="alexandria inter">
            {isLoading ? "…" : data?.plan?.toLowerCase() === "pro" ? "Unlimited" : remaining}
          </p>
        </div>

        <div className="flex flex-col mt-5 sm:mt-6 md:mt-8 justify-center items-stretch gap-3 w-full">
          {invoices.length === 0 && !isLoading && (
            <p className="alexandria text-sm text-white/70">No invoices available yet.</p>
          )}
          {invoices.map((invoice) => (
            <BillingCard key={invoice.id || invoice.date} {...invoice} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingHistory;
