import HeroSection from "../../widgets/HeroSection/HeroSection";
import LandingFooter from "../../widgets/LandingFooter/LandingFooter";
import LandingHeader from "../../widgets/LandingHeader/LandingHeader";
import PosibilitiesSection from "../../widgets/PosibilitiesSection/PosibilitiesSection";
import SubscribeItemsList from "../../widgets/SubscribeItemsList/SubscribeItemsList";

export const Landing = () => {
  return (
    <div className="bg-landing-bg w-full h-full px-4 sm:px-6 md:px-10 lg:px-14 relative">
      <div className="w-full h-40 sm:h-60 md:h-80 lg:h-93 bg-glare absolute rounded-full -top-20 sm:-top-30 md:-top-40 lg:-top-46.5 blur-[100px] sm:blur-[150px] md:blur-[200px] z-0 duration-200"></div>
      <LandingHeader />
      <main>
        <HeroSection />
        <PosibilitiesSection />
        <SubscribeItemsList />
      </main>
      <LandingFooter />
    </div>
  );
};
