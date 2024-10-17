const PrivacyPolicy = () => {
  return (
    <section className="relative w-full bg-gradient-to-r from-yellow-100 to-gray-200 text-black py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8">
          ProChesser Privacy Policy
        </h1>

        <div className="space-y-6 text-lg leading-relaxed">
          {/* Commitment to Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Commitment to Privacy
            </h2>
            <p>
              ProChesser is committed to protecting your privacy. This Privacy
              Policy outlines how we collect, use, and safeguard your personal
              information. By using our services, you consent to the practices
              described in this policy.
            </p>
          </section>

          {/* Information Collection */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Information Collection
            </h2>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>
                Information you provide when creating an account, making
                deposits or withdrawals, or contacting our customer support.
              </li>
              <li>
                Details of your transactions with ProChesser, including betting
                history and account activity.
              </li>
            </ul>
          </section>

          {/* Information Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Information Use</h2>
            <p>
              We may use your personal information for the following purposes:
            </p>
            <ul className="list-disc list-inside ml-6 space-y-2">
              <li>Processing bets and managing your account.</li>
              <li>Conducting research and analysis to improve our services.</li>
              <li>
                Providing you with information about promotions, products, and
                services.
              </li>
              <li>
                Preventing fraud, irregular betting, money laundering, and
                cheating.
              </li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Information Sharing</h2>
            <p>
              ProChesser does not share your personal information with any third
              parties. We may use your information internally for risk
              management purposes and to comply with legal requirements.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Data Retention</h2>
            <p>
              We will retain your information for a reasonable period after you
              close your account, in accordance with applicable laws and
              regulations.
            </p>
          </section>

          {/* Changes to This Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              Changes to This Policy
            </h2>
            <p>
              We reserve the right to update this Privacy Policy at any time.
              Any changes will be posted on our website, and we will notify you
              of significant changes.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your personal
              information. To exercise these rights, please contact our customer
              support.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
