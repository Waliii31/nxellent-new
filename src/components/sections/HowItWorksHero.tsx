import Navbar from "./Navbar";

const HowItWorksHero = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Navbar */}
      <div className="relative z-30">
        <Navbar isFixed={true} />
      </div>

      {/* Background Image */}
      <img
        src="/all-hero.png"
        alt="Hero Background"
        className="w-full h-[45vh] sm:h-[55vh] md:h-[65vh] lg:h-[75vh] object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/90 via-black/50 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 sm:px-6 md:px-8 lg:px-10 pb-6 sm:pb-10 md:pb-14 z-20">
        <h1 className="anybody text-white font-semibold font-[anybody ] text-[26px] sm:text-[34px] md:text-[42px] lg:text-[48px] leading-tight sm:leading-[50px] md:leading-[60px]">
          From Code To Score <br />
          In Minutes
        </h1>

        <p className="alexandria text-white/90 font-light mt-3 sm:mt-4 md:mt-5 font-[Alexandria] text-[13px] sm:text-[15px] md:text-[17px] lg:text-[18px] leading-relaxed tracking-[-0.02em] max-w-2xl">
          NXELLENT scans your smart contracts and apps, applies industry-
          <br className="hidden sm:block" />
          grade rules, and generates a score investors can trust.
        </p>

        <img
          src="/how-properties.png"
          alt="How It Works Illustration"
          className="w-[80%] sm:w-[70%] md:w-[60%] lg:w-auto mt-5 sm:mt-6 md:mt-8 max-w-[600px] h-auto"
        />
      </div>
    </section>
  );
};

export default HowItWorksHero;
