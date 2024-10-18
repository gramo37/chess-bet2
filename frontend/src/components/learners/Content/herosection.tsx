// import { useNavigate } from "react-router-dom";
import { ACADEMY_FRONTEND_URL } from "../../../constants/learner";

const HeroSection = () => {
  // const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white  py-24  shadow-2xl h-full relative overflow-hidden">
      <div className="container mx-auto text-center z-10 relative">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-500 animate-pulse">
          ProChesser Academy: Master Chess and Unlock New Opportunities!
        </h1>
        <h2 className="text-3xl sm:text-4xl text-yellow-400 mb-10 font-semibold">
          Master Chess, Master Your Mind.
        </h2>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-200">
          At ProChesser Academy, we don't just teach you chess - we transform
          you into a strategic thinker capable of handling any challenge on the
          board and beyond. Whether you're a complete beginner or have dabbled
          in the game, our expertly curated lessons, real-world practice, and
          supportive community will take you from amateur to master.
        </p>
        <h2 className="text-3xl sm:text-4xl text-yellow-400 mb-8 font-semibold">
          Join the Journey to Chess Mastery and Gain More than Just Skills!
        </h2>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-200">
          After mastering chess with us, you'll be ready to step into the
          competitive world, including having the chance to earn from your
          skills on our platform, where players can challenge each other for
          real stakes.
        </p>
        <a
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-300"
          href={`${ACADEMY_FRONTEND_URL}/register`}
        >
          Start Your Chess Mastery Journey Today
        </a>
      </div>

      {/* Background elements for added visual flair */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    </section>
  );
};

export default HeroSection;
