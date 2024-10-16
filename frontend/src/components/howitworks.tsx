export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 bg-black">
      <h1 className="text-4xl font-extrabold text-center text-yellow-600 mb-6">
        How It Works
      </h1>

      <div className="space-y-6">
        {/* Step 1: Create an Account */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            1. Create an Account
          </h2>
          <p className="text-white mb-4">
            To start playing, sign up for a ProChesser account. You will need to
            provide a valid email address and create a secure password.
          </p>
        </div>

        {/* Step 2: Fund Your Account */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            2. Fund Your Account
          </h2>
          <p className="text-white mb-4">
            Deposit funds into your account using our secure payment options.
            The minimum deposit amount is $5.
          </p>
        </div>

        {/* Step 3: Enter the Game Lobby */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            3. Enter the Game Lobby
          </h2>
          <p className="text-white mb-4">
            Upon entering the lobby, you will have three options:
          </p>

          <ul className="list-disc list-inside text-white space-y-3">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">➡️</span>
              <div>
                <span className="font-bold">Option 1:</span> Friendly Match:
                Create a game and copy its ID. Select a playtime of either 5 or
                10 minutes, then activate the game by clicking ‘Play’. Share the
                Game ID with a friend to play together—equal stakes are
                required.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">➡️</span>
              <div>
                <span className="font-bold">Option 2:</span> Play Random: Create
                a game with your preferred stakes and activate it by clicking
                ‘Play’. You will typically be matched with an opponent of
                similar skill within five minutes. Please note that these games
                are limited to a duration of 5 minutes.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">➡️</span>
              <div>
                <span className="font-bold">Option 3:</span> Choose Your
                Opponent: Browse available opponents in the game lobby and
                select a match. You will only see games that correspond to your
                skill level. Ensure that your account balance meets the wager
                amount set by the game creator.
              </div>
            </li>
          </ul>
        </div>

        {/* Step 4: Start Playing */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            4. Start Playing
          </h2>
          <p className="text-white mb-4">
            Enjoy your game! Remember to follow the rules and play fair. Good
            luck!
          </p>
        </div>

        {/* Step 5: Withdraw Your Earnings */}
        <div className="bg-[#323029] p-6 rounded-lg shadow-lg ">
          <h2 className="text-3xl font-extrabold text-yellow-600 mb-4">
            5. Withdraw Your Earnings
          </h2>
          <p className="text-white mb-4">
            Once you have completed three games, you can request to withdraw
            your earnings. The minimum withdrawal amount is $5.
          </p>
        </div>
      </div>
    </section>
  );
}
