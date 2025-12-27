import React from "react";
import FeatureCard from "../ui/FeatureCard";
import securityPng from "/Feature-1.png";
import complexityPng from "/Feature-2.png";
import speedPng from "/Feature-3.png";
import ScrollReveal from "../animations/ScrollReveal";

const CoreFeatures: React.FC = () => {
  return (
    <section className="relative w-full">
      <ScrollReveal className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 md:py-16">
        {/* Heading + paragraph */}
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:items-start">
          <h2 className="anybody  text-white text-[32px] sm:text-[40px] md:text-[48px] leading-[42px] sm:leading-14 md:leading-[60px] font-semibold tracking-[-0.00em]">
            Lorem <br className="hidden sm:block" />
            Ipsum loderad
          </h2>

          <p className="alexandria text-white/90 text-[16px] sm:text-[18px] md:text-[20px] leading-[100%] tracking-[-0.02em] max-w-2xl">
            Scan your code, get a risk score, and know exactly where your
            vulnerabilities are before attackers find them. Share results, track
            progress, and improve your system with clarity.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-8 sm:mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          <FeatureCard
            imgSrc={securityPng}
            title="Security First"
            description="Easy to know how cryptocurrency works and friendly to newbie."
            background="linear-gradient(180deg, #02002B 0%, #000234 100%)"
          />
          <FeatureCard
            imgSrc={complexityPng}
            title="Compete & Flex"
            description="Public leaderboards and shareable score cards for maximum flex."
            background="linear-gradient(180deg, #000241 0%, #00003B 100%)"
          />
          <FeatureCard
            imgSrc={speedPng}
            title="Instant Results"
            description="Get your risk score in minutes, not hours."
            background="linear-gradient(180deg, #000027 0%, #010022 100%)"
          />
        </div>
      </ScrollReveal>
    </section>
  );
};

export default CoreFeatures;
