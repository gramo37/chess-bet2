const LearningTools = () => {
  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white py-12 px-6 rounded-lg shadow-2xl relative">
      <div className="container mx-auto text-center z-10 relative">
        <h2 className="text-4xl sm:text-5xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-blue-500 animate-pulse">
          Learning Tools & Resources
        </h2>
        <p className="text-lg sm:text-xl mb-10 max-w-3xl mx-auto leading-relaxed text-gray-200">
          We equip you with all the resources and tools you need to master chess at your own pace:
        </p>

        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 mb-8">
          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Interactive Video Lessons</h3>
            <p className="text-gray-300">
              Our expert coaches guide you through each aspect of the game using easy-to-understand video lessons. Lessons are structured progressively to build your skills step by step, with interactive examples that challenge you to apply what you've learned.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Chess Puzzles & Daily Drills</h3>
            <p className="text-gray-300">
              We provide custom chess puzzles suited to your skill level that help reinforce key concepts, from basic tactics to advanced endgame studies. Daily drills are designed to sharpen your mind and improve your tactical awareness.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Personalized Game Analysis</h3>
            <p className="text-gray-300">
              Get personalized feedback on your games from our certified coaches. We’ll break down your moves, highlight mistakes, and teach you how to think like a chess master, so you can improve with every match.
            </p>
          </div>

          <div className="bg-gray-800 p-6 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:-translate-y-2">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-3">Live Practice Games & Competitive Play</h3>
            <p className="text-gray-300">
              Once you're ready, you can challenge AI or real opponents in our online community. This practice is essential to put theory into action, and as you improve, you can rise through the ranks and showcase your skills.
            </p>
          </div>
        </div>

        <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-105 hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-yellow-300">
          Start Learning with ProChesser Now
        </button>
      </div>

      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
    </section>
  );
};

export default LearningTools;
