import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChessPawn, faVideo, faChalkboardTeacher, faTrophy, faUsers, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';

const WhyChooseProChesserAcademy = () => {
  return (
    <section className="why-choose-prochesser-academy py-12 bg-gradient-to-br from-gray-100 via-gray-300 to-gray-200 text-black mt-0">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* First Column: Heading and Paragraph */}
        <div className="md:w-1/2 text-center md:text-left p-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-blue-600 mb-4">
            Why Choose ProChesser Academy?
          </h2>
          <p className="text-lg leading-relaxed mb-6 text-gray-800">
            Learning chess with ProChesser Academy is more than just a hobby. It’s about developing lifelong skills that empower your critical thinking, problem-solving, and focus. Chess is a powerful tool for mental growth, and our platform is designed to make your learning journey immersive, engaging, and practical.
          </p>
        </div>

        {/* Second Column: Lessons with Icons */}
        <div className="md:w-1/2 p-6">
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Each list item with hover effects and shadow */}
            {[
              {
                icon: faChessPawn,
                title: 'Structured Lessons',
                description: 'Learn at your own pace with step-by-step guidance.',
              },
              {
                icon: faVideo,
                title: 'Interactive Materials',
                description: 'Engage with videos, puzzles, and live games.',
              },
              {
                icon: faChalkboardTeacher,
                title: 'Expert Coaches',
                description: 'Benefit from the support of passionate, experienced instructors.',
              },
              {
                icon: faTrophy,
                title: 'Skill Testing',
                description: 'Challenge yourself against peers and AI opponents.',
              },
              {
                icon: faUsers,
                title: 'Supportive Community',
                description: 'Connect with others who encourage your growth.',
              },
              {
                icon: faMoneyBillWave,
                title: 'Earn Real Money',
                description: 'Master your skills and compete for cash prizes on our platform.',
              },
            ].map((item, index) => (
              <li
                key={index}
                className="group bg-gradient-to-r from-yellow-500 to-gray-700 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl flex items-center space-x-4"
              >
                <FontAwesomeIcon icon={item.icon} className="text-white text-4xl transition-transform group-hover:rotate-12" />
                <div>
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-10000">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseProChesserAcademy;
