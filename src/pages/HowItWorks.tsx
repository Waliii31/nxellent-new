import { ArrowUpRight } from "lucide-react";
import CtaSection from "../components/sections/CtaSection";
import Footer from "../components/sections/Footer";
import HowItWorksHero from "../components/sections/HowItWorksHero";
import WorkStructure from "../components/sections/WorkStructure";
import SecurityPipeline from "../components/sections/SecurityPipeline";
import SecurityByDesign from "../components/sections/SecurityByDesign";

const HowItWorks = () => {
  return (
    <div className="bg-[#020C30]">
      <HowItWorksHero />
      <WorkStructure />
      <SecurityPipeline />
      <SecurityByDesign />
      <CtaSection
        heading={
          <>
            Your code will be judged.<br />Make sure NXELLENT judges it first.
          </>
        }
        primary={{
          label: "Run Full Scan",
          icon: <ArrowUpRight size={16} />,
          whereTo: "projects/my-projects",
        }}
      />
      <Footer />
    </div>
  );
};

export default HowItWorks;
