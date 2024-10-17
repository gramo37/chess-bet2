// import React from 'react';

// const WhyChooseProChesser = () => {
//   return (
//     <section className="bg-white w-screen py-16 px-6 hover:bg-yellow-100 transition-colors duration-300">
//       <div className="container mx-auto">
//         {/* Title */}
//         <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-center mb-12">
//           Why Choose ProChesser?
//         </h2>

//         {/* Features Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {/* Feature 1 */}
//           <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Win Real Money</h3>
//             <p className="text-gray-600">
//               Your victories translate directly to earnings. It's rewarding in every sense.
//             </p>
//           </div>
//            {/* Feature 2 */}
//            <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Same Day Payments</h3>
//             <p className="text-gray-600">
//             Enjoy prompt access to your winnings, as funds are typically processed within 24 hours of your withdrawal request.
//             </p>
//           </div>

//           {/* Feature 2 */}
//           <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skill Matching</h3>
//             <p className="text-gray-600">
//               Fair and challenging matches against players of your level. Our advanced algorithms ensure fair matchmaking.
//             </p>
//           </div>

//           {/* Feature 3 */}
//           <div className="bg-gray-100 border-b border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Live Lessons</h3>
//             <p className="text-gray-600">
//               New to Chess? Enroll in our classes, and we'll guide you through the learning curve until you're a master.
//             </p>
//           </div>

//           {/* Feature 4 */}
//           <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mobile-Friendly Experience</h3>
//             <p className="text-gray-600">
//             Our platform is optimized for mobile, so you can easily play from your laptop, tablet, or smartphone - enjoy your next match wherever you are!
//             </p>
//           </div>

//           {/* Feature 5 */}
//           <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community of Chess Lovers</h3>
//             <p className="text-gray-600">
//               Join players worldwide in your love for chess.
//             </p>
//           </div>

//           {/* Feature 6 */}
//           <div className="bg-gray-100 border-b border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Safe & Secure</h3>
//             <p className="text-gray-600">
//               Top-notch security for your data and transactions.
//             </p>
//           </div>

//           {/* Feature 7 */}
//           <div className="bg-gray-100 border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
//             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Refine Your Skills</h3>
//             <p className="text-gray-600">
//               Learn from others, improve your game, and climb the rankings.
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default WhyChooseProChesser;
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faDollarSign, faBrain, faMobileAlt, faShieldAlt, faUsers, faHandsHelping, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const WhyChooseProChesser = () => {
  return (
    <section className="bg-white w-screen py-16 px-6 hover:bg-yellow-100 transition-colors duration-300">
      <div className="container mx-auto">
        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-center mb-12">
          Why Choose ProChesser?
        </h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faDollarSign} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Win Real Money</h3>
            <p className="text-gray-600">Your victories translate directly to earnings. It's rewarding in every sense.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faTrophy} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Same Day Payments</h3>
            <p className="text-gray-600">Enjoy prompt access to your winnings, as funds are typically processed within 24 hours of your withdrawal request.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faBrain} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Skill Matching</h3>
            <p className="text-gray-600">Fair and challenging matches against players of your level. Our advanced algorithms ensure fair matchmaking.</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faGraduationCap} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Live Lessons</h3>
            <p className="text-gray-600">New to Chess? Enroll in our classes, and we'll guide you through the learning curve until you're a master.</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faMobileAlt} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Mobile-Friendly Experience</h3>
            <p className="text-gray-600">Our platform is optimized for mobile, so you can easily play from your laptop, tablet, or smartphone - enjoy your next match wherever you are!</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faUsers} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Community of Chess Lovers</h3>
            <p className="text-gray-600">Join players worldwide in your love for chess.</p>
          </div>

          {/* Feature 7 */}
          <div className="bg-gray-100 border-b border-r border-yellow-600 p-6 rounded-lg hover:shadow-lg transition duration-300">
            <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-500 text-4xl mb-4" />
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">Safe & Secure</h3>
            <p className="text-gray-600">Top-notch security for your data and transactions.</p>
          </div>

                  {/* Feature 7 */}
          <div className="bg-gray-100 border-r border-yellow-600 p-6 rounded-lg  hover:shadow-lg transition duration-300">
           <FontAwesomeIcon icon={faHandsHelping} className="text-yellow-500 text-4xl mb-4" />

             <h3 className="text-2xl font-semibold text-gray-800 mb-4">Refine Your Skills</h3>
             <p className="text-gray-600">
            Learn from others, improve your game, and climb the rankings.
            </p>
        </div>
      </div>
      </div>
   </section>
  );
};

export default WhyChooseProChesser;