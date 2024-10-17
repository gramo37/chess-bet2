import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const FAQ = () => {
  const navigate = useNavigate();

  // States for toggling FAQ answers visibility
  const [openFAQ, setOpenFAQ] = useState(null);

  // Handle dropdown toggle for each FAQ item
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const toggleFAQ = (index: any) => {
    setOpenFAQ(openFAQ === index ? null : index); 
  };

  const handleExploreMore = () => {
    navigate('/faqs');
  };

  return (
    <section className="bg-gray-100 py-16 px-6 md:px-12">
      <div className="container mx-auto">

        {/* Heading Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300">
            Frequently Asked Questions
          </h2>
        </div>

        {/* FAQ Questions and Answers */}
        <div className="space-y-6">
          {[
            {
              question: 'What Kind of Rewards Can I Earn From Playing?',
              answer: 'By winning games, you can earn an 85% profit. For example, a $100 stake could net you a $185 payout upon victory.'
            },
            {
              question: 'How Can a Beginner Start Playing Chess for Money?',
              answer: 'Beginners are encouraged to register for our Master Chess Classes for guidance and live sessions with tutors.'
            },
            {
              question: 'What Do I Need To Get Started on ProChesser?',
              answer: 'You only need a phone or laptop and a stable internet connection for seamless online gaming.'
            }
          ].map((faq, index) => (
            <div key={index} className="p-4 border-l-4 border-yellow-500 bg-white rounded-lg shadow-lg">
              <h3 
                className="text-l font-semibold text-black mb-2 cursor-pointer flex justify-between items-center"
                onClick={() => toggleFAQ(index)}
              >
                {faq.question}
                {/* Arrow icon to indicate dropdown */}
                <span className={`transform transition-transform ${openFAQ === index ? 'rotate-180' : ''}`}>
                  ⌄
                </span>
              </h3>

              {/* Answer section with smooth dropdown transition */}
              {openFAQ === index && (
                <p className="text-lg text-gray-700 mt-2 transition-opacity duration-300">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Explore More Button */}
        <div className="mt-12 text-center">
          <button
            onClick={handleExploreMore}
            className="bg-yellow-500 hover:bg-yellow-600 text-black hover:text-white font-bold py-3 px-8 rounded-full shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-yellow-300 focus:ring-opacity-50"
          >
            Explore More FAQs
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
