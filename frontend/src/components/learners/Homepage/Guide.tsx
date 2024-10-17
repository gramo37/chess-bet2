import { useNavigate } from "react-router-dom";

const Guide = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-yellow-100 p-8 rounded-lg shadow-md mx-auto ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* First Column */}
        <section className="border-b md:border-r md:border-b-0 border-gray-300 pb-8 md:pb-0 md:pr-4">
          <h2 className="text-xl md:text-2xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-center mb-4">Learn How To Play Chess</h2>
          <p className="text-base md:text-lg text-center">
            New to Chess? No Problem! Discover the beauty of chess with our comprehensive guides, tutorials, and strategies designed for beginners and advanced players alike. Master the fundamentals, refine your technique, and prepare to conquer the board.
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/start-learning")}
              className="bg-yellow-500 text-black py-2 px-6 rounded-full hover:bg-yellow-600 hover:text-white font-bold transition-colors"
            >
              Start Learning
            </button>
          </div>
        </section>

        {/* Second Column */}
        <section className="border-b md:border-r md:border-b-0 border-gray-300 pb-8 md:pb-0 md:pl-4 md:pr-4">
          <h3 className="text-xl md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300  text-center mb-4">Join the Community</h3>
          <p className="text-base md:text-lg text-center">
            Join our vibrant community of chess lovers and enthusiasts. Share stories and strategies, and celebrate victories together. Participate in community events, tournaments, and workshops designed to bring out the grandmaster in you.
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/join-now")}
              className="bg-yellow-500 text-black py-2 px-6 rounded-full hover:bg-yellow-600 hover:text-white font-bold  transition-colors"
            >
              Join Now
            </button>
          </div>
        </section>

        {/* Third Column */}
        <section className="pb-8 md:pl-4">
          <h3 className="text-xl md:text-xl font-bold  bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-center mb-4"> Our Newsletter </h3>
          <p className="text-base md:text-lg text-center">
            Subscribe to our newsletter for the latest updates and exclusive offers. Get chess tips, updates on upcoming tournaments, and more directly in your inbox.
          </p>
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/subscribe")}
              className="bg-yellow-500 mt-12 text-black py-2 px-6 rounded-full hover:bg-yellow-600 hover:text-white font-bold transition-colors"
            >
              Subscribe
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Guide;
