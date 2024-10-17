import React from 'react';

const CommunitySection = () => {
  return (
    <section className="community-and-support py-12 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 text-white rounded-lg shadow-lg overflow-hidden">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-extrabold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-600">
          Community and Support
        </h2>
        <p className="text-lg mb-8 text-center">
          When you join ProChesser Academy, you're not just signing up for lessons—you're joining a supportive and vibrant chess community.
        </p>
        <ul className="list-disc list-inside space-y-4">
          <li className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <strong className="text-yellow-400">Chess Forums</strong>: Share ideas, ask questions, and learn from peers and coaches alike.
          </li>
          <li className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <strong className="text-yellow-400">Study Groups</strong>: Join virtual study groups led by coaches and engage with fellow students.
          </li>
          <li className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <strong className="text-yellow-400">Weekly Challenges</strong>: Test your skills with unique challenges designed to hone your tactical and strategic abilities.
          </li>
          <li className="bg-gray-800 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow duration-300">
            <strong className="text-yellow-400">Online Tournaments</strong>: Compete in exclusive tournaments and earn rankings as you progress through your training.
          </li>
        </ul>
        <div className="flex justify-center mt-6">
          <button className="bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-full shadow-md transform transition-transform hover:bg-yellow-600 hover:scale-105 duration-300">
            Join the ProChesser Community
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
