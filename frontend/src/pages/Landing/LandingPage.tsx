import HeroSection from "../../widgets/HeroSection/HeroSection";
import LandingFooter from "../../widgets/LandingFooter/LandingFooter";
import LandingHeader from "../../widgets/LandingHeader/LandingHeader";
import PosibilitiesSection from "../../widgets/PosibilitiesSection/PosibilitiesSection";
import PricesSection from "../../widgets/PricesSection/PricesSection";

export const Landing = () => {
  return (
    <div className="bg-linear-to-b from-landing-bg-1 via-landing-bg-2 to-landing-bg-4 w-full h-full px-14 relative">
      <div className="w-full h-93 bg-glare absolute rounded-full -top-46.5 blur-[200px] z-0 duration-200"></div>
      <LandingHeader />
      <main>
        <HeroSection />
        <PosibilitiesSection />
        <PricesSection />
      </main>
      <LandingFooter />
    </div>
  );
};
