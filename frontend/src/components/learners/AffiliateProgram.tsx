const AffiliateProgram = () => {
  return (
    <section className="relative w-full bg-gradient-to-r from-yellow-100 to-gray-200 text-black py-20 px-6">
      {/* Decorative Background */}
      <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-100 to-yellow-100 opacity-10 pointer-events-none"></div>

      {/* Content Container */}
      <div className="relative container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-center mb-12 tracking-tight">
          Join the ProChesser Affiliate Program
        </h2>

        {/* Introduction */}
        <p className="text-lg md:text-xl text-center mb-12 max-w-3xl mx-auto text-gray-700 leading-relaxed">
          Unlock your earning potential with 3% lifetime commissions! Welcome to
          the ProChesser Affiliate Program, where you can combine your passion
          for chess with the opportunity to earn extra income.
        </p>

        {/* Benefits Section */}
        <div className="space-y-10">
          {[
            {
              title: "Earn 3% Commission on All Deposits",
              description:
                "Every time a user signs up with your referral code, you earn 3% of their deposits. Each stake they place means ongoing earnings for you—forever!",
            },
            {
              title: "Lifetime Commissions",
              description:
                "You continue earning 3% on all future deposits made by your referrals for as long as they are active on the platform.",
            },
            {
              title: "Monthly Payouts",
              description:
                "Get your earnings directly at the end of each month when your commissions reach $50, via your preferred payment method.",
            },
            {
              title: "High Earning Potential",
              description:
                "Top marketers earn a minimum of $700 per month. With dedication, your earnings can grow substantially.",
            },
            {
              title: "Referral Bonuses for New Users",
              description:
                "New users referred by your unique referral ID will receive a $3 bonus, enhancing your referral potential.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start p-6 bg-white shadow-md hover:bg-yellow-500 transition-all duration-300 rounded-lg transform hover:-translate-y-2"
            >
              <span className="text-2xl font-bold text-black md:mr-6 mb-4 md:mb-0">
                {index + 1}.
              </span>
              <p className="text-lg text-gray-700">
                <strong>{benefit.title}:</strong> {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Effortless Tracking Section */}
        <div className="mt-16 space-y-10 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">
            Effortless Tracking of Your Success
          </h3>
          <p className="text-xl text-center mb-6 max-w-2xl mx-auto">
            Track your affiliate performance easily through our comprehensive
            dashboard:
          </p>
          {[
            {
              title: "Sign Up",
              description: "Create your account on ProChesser as a gamer.",
            },
            {
              title: "Access the Affiliate Dashboard",
              description:
                "Navigate to your account page and click on the “Referral Program” button. Here, you’ll find all the essential information.",
            },
            {
              title: "Share Your Unique Referral ID",
              description:
                "Promote your personal referral ID. Anyone who registers using your ID becomes your referral, and you’ll earn from their deposits.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start p-6 bg-white shadow-md hover:bg-yellow-500 transition-all duration-300 rounded-lg transform hover:-translate-y-2"
            >
              <span className="text-2xl font-bold text-black md:mr-6 mb-4 md:mb-0">
                {index + 1}.
              </span>
              <p className="text-lg text-gray-700">
                <strong>{benefit.title}:</strong> {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* How It Works Section */}
        <div className="mt-16 space-y-10 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">How It Works</h3>
          <p className="text-xl text-center mb-6 max-w-2xl mx-auto">
            Start earning in a few simple steps:
          </p>
          {[
            {
              title: "Track Sign-Ups",
              description:
                "Monitor the total number of users you’ve referred to gauge your campaign effectiveness.",
            },
            {
              title: "Track Payments",
              description:
                "Receive detailed monthly reports on your payouts, complete with all relevant payment information.",
            },
            {
              title: "All-Time Earnings",
              description:
                "Access a complete history of your earnings, so you can see how far you've come.",
            },
            {
              title: "Track Orders",
              description:
                "Keep tabs on the number of deposits made by your referrals and identify your top performers.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start p-6 bg-white shadow-md hover:bg-yellow-500 transition-all duration-300 rounded-lg transform hover:-translate-y-2"
            >
              <span className="text-2xl font-bold text-black md:mr-6 mb-4 md:mb-0">
                {index + 1}.
              </span>
              <p className="text-lg text-gray-700">
                <strong>{benefit.title}:</strong> {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Understanding Dashboard Section */}
        <div className="mt-16 space-y-10 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">
            Understanding Your Dashboard
          </h3>
          <p className="text-xl text-center mb-6 max-w-2xl mx-auto">
            Your dashboard gives a complete overview of your progress:
          </p>
          {[
            {
              title: "Referral ID",
              description:
                "This unique ID is what you’ll distribute. All sign-ups using this ID will count as your referrals.",
            },
            {
              title: "Referrals Count",
              description: "View the total number of users you’ve referred.",
            },
            {
              title: "Commission Percentage",
              description:
                "See the percentage you earn from your referrals' deposits.",
            },
            {
              title: "Payments Overview",
              description:
                "Track how many deposits have been made by your referrals and watch your referral balance grow.",
            },
            {
              title: "Total Earnings",
              description:
                "Keep track of your total earnings, which will remain visible even after you withdraw funds.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start p-6 bg-white shadow-md hover:bg-yellow-500 transition-all duration-300 rounded-lg transform hover:-translate-y-2"
            >
              <span className="text-2xl font-bold text-black md:mr-6 mb-4 md:mb-0">
                {index + 1}.
              </span>
              <p className="text-lg text-gray-700">
                <strong>{benefit.title}:</strong> {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Withdrawal Process */}
        <div className="mt-16 space-y-10 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">
            Easy Withdrawal Process
          </h3>
          <p className="text-xl text-center mb-6 max-w-2xl mx-auto">
            Withdraw your earnings in two simple steps:
          </p>
          {[
            {
              title: "Transfer to Internal Balance",
              description:
                "Withdraw your earnings to your internal ProChesser balance.",
            },
            {
              title: "Choose Your Payment Method",
              description:
                "Go to the withdrawals page to transfer your funds to PayPal, cryptocurrency, or mobile money. Your funds will be processed manually and credited to your chosen wallet within 24 hours.",
            },
          ].map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row items-start p-6 bg-white shadow-md hover:bg-yellow-500 transition-all duration-300 rounded-lg transform hover:-translate-y-2"
            >
              <span className="text-2xl font-bold text-black md:mr-6 mb-4 md:mb-0">
                {index + 1}.
              </span>
              <p className="text-lg text-gray-700">
                <strong>{benefit.title}:</strong> {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* FAQs Section */}
        <div className="mt-16 space-y-10 text-gray-800">
          <h3 className="text-3xl font-bold text-center mb-6">
            Frequently Asked Questions (FAQs)
          </h3>
          <div className="space-y-6  mx-auto">
            {[
              {
                question: "What is the ProChesser Affiliate Program?",
                answer:
                  "It allows you to earn money by promoting ProChesser and referring new users.",
              },
              {
                question: "How does it work?",
                answer:
                  "Sign up, share your referral ID, and earn 3% on every deposit made by your referrals.",
              },
              {
                question: "How much can I earn?",
                answer:
                  "You earn 3% lifetime commission on every deposit made by your referrals.",
              },
              {
                question: "What if I forget to withdraw?",
                answer:
                  "Your balance will roll over to the next month automatically.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="p-4 border-l-4 border-yellow-500 bg-white rounded-lg shadow-lg w-full"
              >
                <h3 className="text-2xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-black hover:from-pink-500 hover:to-yellow-500 transition-colors duration-300 text-black mb-2">
                  {faq.question}
                </h3>
                <p className="text-lg text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AffiliateProgram;
