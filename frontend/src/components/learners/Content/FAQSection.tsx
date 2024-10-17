const FaqsSection = () => {
  const faqs = [
    {
      question: 'Who can join ProChesser Academy?',
      answer: 'Anyone! Whether you\'re an absolute beginner or an intermediate player looking to improve, we have lessons tailored to your level.',
    },
    {
      question: 'How are the classes delivered?',
      answer: 'All lessons are delivered online through video tutorials, live practice games, and interactive exercises. You can learn at your own pace.',
    },
    {
      question: 'How long does it take to see improvement?',
      answer: 'It depends on your dedication. Most students see noticeable improvements within the first month of consistent practice.',
    },
    {
      question: 'Do I need any chess knowledge before signing up?',
      answer: 'No prior knowledge is required! Our beginner package is designed to help you learn from the ground up.',
    },
    {
      question: 'Will I get personalized feedback?',
      answer: 'Yes, our coaches provide personalized game analysis and feedback tailored to help you improve.',
    },
    {
      question: 'How often can I access the materials?',
      answer: 'You have unlimited access to all the learning materials for the duration of your subscription.',
    },
    {
      question: 'Are there live practice games?',
      answer: 'Yes! You can play live games with fellow students or AI opponents anytime on our platform.',
    },
    {
      question: 'Can I really earn from playing chess?',
      answer: 'Once you master the game, you’ll have the opportunity to participate in matches where you can earn from your skills.',
    },
    {
      question: 'How are the chess coaches qualified?',
      answer: 'Our coaches include experienced professionals, some of whom hold titles like Grandmaster and International Master.',
    },
    {
      question: 'What’s the difference between the beginner, intermediate, and advanced packages?',
      answer: 'Each package is tailored to different levels of experience. Beginners focus on fundamentals, intermediates dive into strategy, and advanced learners refine their skills for competitive play.',
    },
    {
      question: 'Can I upgrade my package if I improve?',
      answer: 'Absolutely! You can upgrade to a higher-level package anytime to keep progressing in your chess journey.',
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'We don’t offer free trials, but our packages are designed to deliver exceptional value and a strong learning experience for every player.',
    },
  ];

  return (
    <section className="faqs-section py-12 bg-gray-100">
      <h2 className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-600">Frequently Asked Questions</h2>
      <div className="faq-grid grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-8">
        {faqs.map((faq, index) => (
          <div
            className="faq-card border rounded-3xl p-6 bg-white shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:bg-gray-500 text-black hover:text-white"
            key={index}
          >
            <h3 className="text-2xl font-semibold text-yellow-500 font-bold mb-4">{faq.question}</h3>
            <p className="text-gray-900 hover:text-white">{faq.answer}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <a href="/signup" className="bg-yellow-600 text-white py-2 px-4 rounded-full hover:text-white hover:bg-yellow-700 transition duration-300">
          Sign Up and Start Your Journey Today
        </a>
      </div>
    </section>
  );
};

export default FaqsSection;
