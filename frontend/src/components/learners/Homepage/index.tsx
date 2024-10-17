import GameLobbySection from "./GameLobbySection";
import Guide from "./Guide";
import HeroSection from "./HeroSection";
import FAQ from "./miniFAQ";
import MiniHowItWorks from "./miniHowItWorks";
import Testimonials from "./Testimonials";
import WhoAreWe from "./WhoAreWe";
import WhyChooseProChesser from "./WhyChooseProChesser";

const HomePage = () => {
  return (
    <div className="w-full">
      <HeroSection />
      <MiniHowItWorks />
      <GameLobbySection />
      <WhyChooseProChesser />
      <WhoAreWe />
      <FAQ />
      <Testimonials />
      <Guide />
    </div>
  );
};

export default HomePage;
