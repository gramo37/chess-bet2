import HeroSection from "../Homepage/HeroSection";
import FaqsSection from "./FAQSection";
import YourFutureAwaits from "./Future";
import LearningSection from "./LearningPackages";
import LearningTools from "./LearningTools";
import WhyChooseProChesserAcademy from "./WhyChoosePro";
import CommunityAndSupport from './Community';

const Content =() => {
  return (
    <div className="content">
      <HeroSection />
      <WhyChooseProChesserAcademy />
      <YourFutureAwaits/>
      <LearningSection />
      <LearningTools/>
      <CommunityAndSupport />
      <FaqsSection />
    </div>
  );
};

export default Content;