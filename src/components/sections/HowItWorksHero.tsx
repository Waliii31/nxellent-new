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
        <h1 className="text-white font-semibold text-lg sm:text-2xl md:text-4xl lg:text-5xl leading-tight">
          Cybersecurity Assessment for <br /> Your Projects.
        </h1>

        <p className="text-white/90 font-light mt-4 sm:mt-5 md:mt-6 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed tracking-tight max-w-2xl">
          NXELLENT analyses your code identifies security risks, and produces decision grade risk <br /> intelligence with recommendations founders and investors can act on.
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
