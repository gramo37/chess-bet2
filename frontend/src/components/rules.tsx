export default function ProChesserRules() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 bg-black">
      <h1 className="text-4xl font-extrabold text-center text-yellow-600 mb-6">
        ProChesser Rules
      </h1>

      <div className="space-y-6">
        {/* Rule 1: Eligibility */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            1. Eligibility
          </h2>
          <p className="text-white">
            All ProChesser users must be 18 years or older. Age verification may
            be required.
          </p>
        </div>

        {/* Rule 2: User Conduct */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            2. User Conduct
          </h2>
          <p className="text-white mb-2">
            Offensive or abusive language is strictly prohibited.
          </p>
          <ul className="list-none text-white space-y-2">
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> Personal attacks,
              harassment, or threats towards other users will not be tolerated.
            </li>
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> Any form of game
              manipulation or cheating is grounds for immediate termination of
              the account.
            </li>
          </ul>
        </div>

        {/* Rule 3: Game Play */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            3. Game Play
          </h2>
          <p className="text-white mb-2">
            The minimum stake amount for a game is $5.
          </p>
          <ul className="list-none text-white space-y-2">
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> Users cannot
              create or join a new game while a current or previous game is in
              progress.
            </li>
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> Resigning from a
              game results in a loss, while a draw does not affect the user's
              stake.
            </li>
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> Winners receive a
              generous 85% of their total stake as profit, while ProChesser
              retains a 15% commission.
            </li>
            <li>
              <span className="text-yellow-600 mr-2">➡️</span> A minimum of
              three games must be played before a withdrawal request can be
              processed.
            </li>
          </ul>
        </div>

        {/* Rule 4: ProChesser Tournaments */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            4. ProChesser Tournaments
          </h2>
          <p className="text-white">
            Tournaments are hosted exclusively by ProChesser. Team play or group
            participation is not allowed.
          </p>
        </div>

        {/* Rule 5: Funds Management */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            5. Funds Management
          </h2>
          <p className="text-white">
            The minimum deposit and withdrawal amount is $5.
          </p>
        </div>

        {/* Rule 6: Reporting Issues */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            6. Reporting Issues
          </h2>
          <p className="text-white">
            To report a rule violation or a dispute with another user, please
            reach out to ProChesser support by using the ‘report’ button in your
            account section. Be sure to include the game ID, the name/username
            of the individual involved, and a detailed description of the issue.
          </p>
        </div>

        {/* Rule 7: Rules Enforcement */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            7. Rules Enforcement
          </h2>
          <p className="text-white mb-2">
            ProChesser reserves the right to modify or amend these rules at any
            time. Violations of these rules may result in temporary or permanent
            account suspension or termination, without refund.
          </p>
          <p className="text-white">
            By using ProChesser, you agree to abide by these rules and
            regulations.
          </p>
        </div>
      </div>
    </section>
  );
}
