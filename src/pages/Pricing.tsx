import { ArrowUpRight } from "lucide-react";
import CtaSection from "../components/sections/CtaSection";
import Footer from "../components/sections/Footer";
import PricingHero from "../components/sections/PricingHero";
import FoundersPricing from "../components/sections/FoundersPricing";
import InvestorPricing from "../components/sections/InvestorPricing";
import PrimaryButton from "../components/ui/PrimaryButton";
import TrustedBySection from "../components/sections/TrustedBySection";

import { useNavigate } from "react-router-dom";
import { useCreatePayPerScanCheckout } from "../hooks/api/useBilling";

const Pricing = () => {
  const navigate = useNavigate();
  const buyScan = useCreatePayPerScanCheckout();

  const handleBuyScan = async () => {
    // Check for token in storage (covering both key variants)
    const token = localStorage.getItem("nxellent_access_token") || localStorage.getItem("nx_token");
    if (!token) {
      navigate("/auth/signup"); // Use correct route for signup
      return;
    }

    try {
      const response = await buyScan.mutateAsync({
        quantity: 1, // Buying 1 scan
        successUrl: `${window.location.origin}/scanner?scan_purchased=true`,
        cancelUrl: `${window.location.origin}/pricing`
      });

      if (response?.checkoutUrl) {
        window.location.href = response.checkoutUrl;
      }
    } catch {
      // Failed to initiate buy scan
    }
  };

  return (
    <div className="bg-[#020C30]">
      <PricingHero />
      <FoundersPricing />
      <InvestorPricing />
      <section className="w-full bg-[#000124] py-16 my-12">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="anybody text-3xl mb-8 text-white md:text-4xl font-semibold leading-tight">
            Just Curious?
          </h1>
          <p className="alexandria mb-8 text-white/70">
            Run a one-time NXELLENT scan without a subscription.
          </p>
          <div className="text-white mb-9 flex justify-center items-center gap-2">
            <span className="urbanist text-4xl font-extrabold">$15</span>
            <div className="text-xl text-white/80 font-light">Per Scan</div>
          </div>
          <div className="flex justify-center items-center">
            <PrimaryButton
              children={buyScan.isPending ? "Processing..." : "Buy Scan Now"}
              icon={!buyScan.isPending ? <ArrowUpRight size={16} /> : undefined}
              onClick={handleBuyScan}
              disabled={buyScan.isPending}
            />
          </div>
        </div>
      </section>
      <section className="w-full py-12">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="anybody  text-4xl text-white md:text-5xl font-semibold leading-tight mb-4">
            Compare Plans
          </h2>
          <p className="alexandria mb-8 text-white/70">
            See exactly what’s included in each plan
          </p>
          <div className="flex justify-center items-center">
            <img className="w-full h-auto" src="/compare-plan.svg" alt="" />
          </div>
        </div>
      </section>
      <TrustedBySection />
      <CtaSection
        heading={
          <>
            start your first nxellent scan today. <br /> prove your code is ready.
          </>
        }
        primary={{
          label: "Submit Your Project",
          icon: <ArrowUpRight size={16} />,
          whereTo: "projects/my-projects",
        }}
      />
      <Footer />
    </div>
  );
};

export default Pricing;
