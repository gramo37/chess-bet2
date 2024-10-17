const GameLobbySection = () => {
  return (
    <section className="bg-black w-screen py-12 px-6 md:py-16 md:px-8">
      <div className="container mx-auto text-center max-w-screen-lg">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 md:mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 tracking-tight">
          Ready to Make Your Move? <br /> Welcome to the Game Lobby
        </h2>

        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
          Explore our diverse game lobby, where players of all levels find their match. Every game, from casual to ranked matches, is an opportunity to sharpen your skills and increase your earnings. Pick your challenge. Make your move.
        </p>

        {/* Button */}
        <a
          href="/game"
          className="bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
        >
          Explore the Game Lobby
        </a>
      </div>
    </section>
  );
};

export default GameLobbySection;
