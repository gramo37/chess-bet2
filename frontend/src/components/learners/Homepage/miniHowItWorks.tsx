import { useNavigate } from 'react-router-dom';

const MiniHowItWorks = () => {
  const navigate = useNavigate();

  const handleLearnMoreClick = () => {
    navigate('/how-it-works'); 
  };

  return (
    <section className="how-it-works-section py-12 bg-gray-100 flex justify-center">
      <div className="content text-center px-4 sm:px-8 text-base sm:text-lg text-gray-900 max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300">
          Experience the Excitement of ProChesser
        </h2>
        <p className="mb-6 font-semibold">
          Join ProChesser for an immersive multiplayer chess experience where strategic minds compete for glory and stakes! Sign up for free, deposit funds, and dive into the game lobby to choose from friendly matches, random opponents, or select your challenger.
        </p>
        <p className="mb-6 font-semibold">
          Engage in fast-paced blitz games, aiming for checkmate or a time victory, and enjoy up to 85% profit on your stakes. After playing at least three games, you can easily withdraw your winnings, typically processed within 24 hours.
        </p>
        <button
          onClick={handleLearnMoreClick}
          className="bg-yellow-500 justify-center hover:bg-yellow-600 text-black hover:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
        >
          Learn More About How It Works
        </button>
      </div>
    </section>
  );
};

export default MiniHowItWorks;
