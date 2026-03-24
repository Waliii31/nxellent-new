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
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/50 to-transparent" />

      {/* Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 md:px-8 lg:px-10 min-h-[60vh] md:min-h-[70vh] flex flex-col items-center justify-center text-center">
        <h1 className="anybody text-white font-semibold text-[28px] sm:text-[36px] md:text-[44px] lg:text-[52px] leading-tight tracking-[-0.01em]">
          Cybersecurity Assessment for <br /> Your Projects.
        </h1>

        <p className="alexandria text-white/90 font-light mt-3 sm:mt-4 md:mt-5 text-[14px] sm:text-[16px] md:text-[18px] leading-relaxed tracking-[-0.02em] max-w-2xl">
          NXELLENT analyses your code identifies security risks, and produces decision grade risk <br className="hidden md:block" /> intelligence with recommendations founders and investors can act on.
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
