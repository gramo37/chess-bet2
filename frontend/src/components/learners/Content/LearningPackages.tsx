import { FaCheckCircle } from "react-icons/fa";
import { ACADEMY_FRONTEND_URL, packages } from "../../../constants/learner";

const LearningSection = () => {
  return (
    <section id="learningpath" className="learning-section py-12 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
        Our Learning Packages
      </h2>
      <div className="package-grid grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8">
        {packages.map((packageData: any, index: number) => (
          <div
            className="package-card border rounded-3xl p-6 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gray-500 text-black hover:text-white"
            key={index}
          >
            <h3 className="text-2xl font-bold mb-4">
              {packageData.name}
              {packageData.popularLabel && (
                <span className="bg-yellow-600 text-white font-semibold text-xs uppercase rounded-full px-2 ml-2">
                  {packageData.popularLabel}
                </span>
              )}
              {packageData.recommendedLabel && (
                <span className="bg-yellow-600 text-white font-semibold text-xs uppercase rounded-full px-2 ml-2">
                  {packageData.recommendedLabel}
                </span>
              )}
            </h3>
            <p className="text-xl mb-4 font-bold">{packageData.price}</p>
            <p className="text-gray-900 mb-6 hover:text-white">
              {packageData.description}
            </p>
            <h4 className="text-lg font-semibold mb-2">What You'll Learn:</h4>
            <ul className="list-inside space-y-2 mb-6">
              {packageData.whatYoullLearn.map((lesson: any, i: number) => (
                <li
                  className="flex items-center text-gray-900 hover:text-white transition-colors"
                  key={i}
                >
                  <FaCheckCircle className="text-yellow-600 mr-2" />{" "}
                  {/* Tick icon */}
                  {lesson}
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-semibold mb-2">Included Materials:</h4>

            <ul className="list-inside space-y-2 mb-6">
              {packageData.includedMaterials.map((material: any, i: number) => (
                <li
                  className="flex items-center text-gray-900 hover:text-white transition-colors"
                  key={i}
                >
                  <FaCheckCircle className="text-yellow-600 mr-2 w-5 h-5" />{" "}
                  {/* Tick icon */}
                  {material}
                </li>
              ))}
            </ul>

            <div className="flex justify-center mt-4">
              <button
                className="bg-yellow-600 text-white font-bold py-2 px-6 rounded-full hover:bg-yellow-500 hover:shadow-lg transition-colors duration-300"
                onClick={() => {
                  window.location.href = `${ACADEMY_FRONTEND_URL}/register`;
                }}
              >
                {packageData.cta}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LearningSection;
