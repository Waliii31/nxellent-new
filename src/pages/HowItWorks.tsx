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
            Your Code is already being judged. <br />
            Make sure it’s nxellent
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

export default HowItWorks;
