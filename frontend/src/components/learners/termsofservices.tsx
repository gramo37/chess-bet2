const TermsOfService = () => {
  return (
    <section className="relative w-full bg-gradient-to-r from-yellow-100 to-gray-200 text-black py-20 px-6">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-8 capitalize">
          ProChesser Terms of Service
        </h1>

        <div className="space-y-6 text-lg leading-relaxed">
          {/* Welcome */}
          <section>
            <p>
              Welcome to ProChesser.com! These Terms of Service ("Terms") govern
              your access to and use of the ProChesser.com website ("Website")
              and related services ("Service"). By accessing or using the
              Service, you agree to be bound by these Terms.
            </p>
          </section>

          {/* 1. Eligibility */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">1. Eligibility</h2>
            <p>
              You must be at least 18 years old to use the Service. ProChesser
              reserves the right to request proof of age and may suspend your
              account until such proof is provided. ProChesser takes its
              responsibilities regarding underage gambling very seriously.
            </p>
          </section>

          {/* 2. User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">2. User Accounts</h2>
            <p>
              You may only have one ProChesser account. ProChesser reserves the
              right to close duplicate accounts without warning. You are
              responsible for keeping your account information accurate and
              up-to-date. ProChesser will not sell or share your personal
              information with third parties except as required by law or to
              protect its rights or the safety of users. You are responsible for
              maintaining the confidentiality of your login credentials and for
              all activity that occurs under your account.
            </p>
          </section>

          {/* 3. Security and Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              3. Security and Privacy
            </h2>
            <p>
              ProChesser complies with the Children's Online Privacy Protection
              Act (COPPA) and prohibits use of the Service by anyone under 18.
              ProChesser does not monitor communications but reserves the right
              to remove content deemed harmful, offensive, or in violation of
              its rules. You acknowledge that ProChesser assumes no liability
              for loss of confidentiality due to circumstances beyond its
              control. ProChesser may permanently close your account if it
              believes you have used the Service unfairly or cheated. You are
              obligated to report suspected cheating by another user.
            </p>
          </section>

          {/* 4. Funds */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">4. Funds</h2>
            <p>
              You can only bet/stake with cleared funds in your account.
              Deposits are intended for placing chess bets and are not
              interest-bearing. Funds must be used for intended purposes within
              180 days to avoid account suspension. Deposited funds are held in
              designated client accounts separate from ProChesser's own accounts
              for insolvency protection. ProChesser reserves the right to void
              bets placed with insufficient funds. Account adjustments will be
              made to recover erroneously credited funds. Funds cannot be
              deposited and immediately withdrawn without a minimum of 3
              bets/stakes placed.
            </p>
          </section>

          {/* 5. Disclaimer of Warranties */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              5. Disclaimer of Warranties
            </h2>
            <p>
              YOU USE THE SERVICE AT YOUR SOLE RISK. THE SERVICE IS PROVIDED "AS
              IS" AND "AS AVAILABLE." ProChesser DISCLAIMS ALL WARRANTIES,
              EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A
              PARTICULAR PURPOSE, AND NON-INFRINGEMENT. ProChesser does not
              warrant uninterrupted, timely, secure, or error-free service or
              the accuracy of information obtained through the Service.
            </p>
          </section>

          {/* 6. Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              6. Limitation of Liability
            </h2>
            <p>
              ProChesser SHALL NOT BE LIABLE FOR ANY DIRECT, INDIRECT,
              INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES ARISING FROM USE OR
              INABILITY TO USE THE SERVICE. This includes damages for loss of
              profits, use, data, or other intangibles, even if ProChesser has
              been advised of the possibility of such damages.
            </p>
          </section>

          {/* 7. Resale or Commercial Use */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              7. Resale or Commercial Use
            </h2>
            <p>
              You may not resell or make commercial use of the Service without
              ProChesser's express consent.
            </p>
          </section>

          {/* 8. Immoral and Unfair External Assistance */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              8. Immoral and Unfair External Assistance
            </h2>
            <p>
              Using computer engines or having another person play your moves is
              strictly prohibited.
            </p>
          </section>

          {/* 9. Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">9. Indemnification</h2>
            <p>
              You agree to indemnify and hold harmless ProChesser, its
              affiliates, officers, and employees from any claims or demands
              arising from your use of the Service, violation of these Terms, or
              infringement of intellectual property rights.
            </p>
          </section>

          {/* 10. ProChesser Intellectual Property Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              10. ProChesser Intellectual Property Rights
            </h2>
            <p>
              The Website content is protected by international copyright and
              intellectual property laws. You may not reproduce, store, modify,
              copy, republish, upload, post, transmit, or distribute any part of
              the Website without ProChesser's written consent. Commercial use
              of the Website or its content is strictly prohibited.
            </p>
          </section>

          {/* 11. Changes to Terms of Service */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">
              11. Changes to Terms of Service
            </h2>
            <p>
              ProChesser may change these Terms at any time. Your continued use
              of the Service constitutes your agreement to the revised Terms.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
};

export default TermsOfService;
