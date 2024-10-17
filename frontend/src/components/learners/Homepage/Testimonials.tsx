import { useState, useEffect } from 'react';

const testimonialsData = [
  {
    quote: "Finally, a chess platform that truly values skill and intelligence. It's thrilling, competitive, and rewarding.",
    author: "Alejandro H.",
  },
  {
    quote: "The thrill of real competition plus the bonus of earning money? Sign me up!",
    author: "James F.",
  },
  {
    quote: "ProChesser transformed how I enjoy chess. Winning has never been so rewarding!",
    author: "Wilkins D.",
  },
  {
    quote: "ProChesser has transformed how I view chess. Winning cash for my strategic plays is unbelievably rewarding!",
    author: "Santiago M.",
  },
  {
    quote: "A seamless interface and a vibrant community. My go-to platform for chess.",
    author: "Alvaro G.",
  },
];

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonialsData.length);
      }, 5000); // Change testimonial every 5 seconds

      return () => clearInterval(interval);
    }
  }, [isPaused]);

  const handleTestimonialClick = () => {
    setIsPaused(true); // Pause the interval when a testimonial is clicked
  };

  const currentTestimonial = testimonialsData[currentIndex];

  return (
    <section className="bg-gray-100 py-16 px-6 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* First Column */}
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 mb-4 md:mb-6">
              Testimonials
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Hear From Our Victorious Players
            </h3>
            <p className="text-lg text-gray-600">
              Discover what our players have to say about their journey with ProChesser!
            </p>
          </div>

          {/* Second Column - Display one testimonial at a time */}
          <div className="flex items-center justify-center">
            <blockquote
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-md text-white italic cursor-pointer max-w-lg transition-transform transform hover:scale-105"
              onClick={handleTestimonialClick} // Pause on click
              aria-label={`Testimonial from ${currentTestimonial.author}`} // Accessibility
              role="blockquote" // Accessibility
            >
              "{currentTestimonial.quote}"
              <span className="block mt-4 text-gray-200 font-semibold">
                – {currentTestimonial.author}
              </span>
            </blockquote>
          </div>
        </div>

        {/* Call to Action Button */}
        <div className="mt-10 text-center">
          <button 
              className="bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white font-bold py-4 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
              onClick={() => alert("Join Us!")} // Example action
            aria-label="Join the community where your skills pay off" // Accessibility
          >
            Join a Community Where Your Skills Pay Off
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
