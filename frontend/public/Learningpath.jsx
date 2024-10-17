import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles

const LearningPath = ({ modules }) => {
  const [date, setDate] = useState(new Date()); // State to hold the selected date

  const handleDateChange = (newDate) => {
    setDate(newDate);
    // Handle scheduling logic here (e.g., save to the database or show a message)
    alert(`Scheduled lesson on ${newDate.toDateString()}`);
  };

  return (
    <section className="learning-path w-full p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-yellow-300 text-center">Learning Path</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <div key={index} className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300">
            <h3 className="text-xl font-semibold text-yellow-300">{module.title}</h3>
            <p className="text-gray-300 mt-2">{module.description}</p>
            <button className="mt-4 bg-yellow-500 text-gray-900 py-2 px-4 rounded-full transition duration-300 hover:bg-yellow-600 focus:outline-none focus:ring-4 focus:ring-yellow-300">
              Start
            </button>
          </div>
        ))}
      </div>

      {/* Calendar Component */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-yellow-300 text-center mb-4">Schedule Your Lesson</h3>
        <Calendar
          onChange={handleDateChange}
          value={date}
          className="mx-auto" // Center the calendar
        />
      </div>
    </section>
  );
};

export default LearningPath;
