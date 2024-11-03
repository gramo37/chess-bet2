import { FiUser, FiUserCheck } from "react-icons/fi";
import usePersonStore from "../../../contexts/auth";
import Refresh from "../../Refresh";

const UserDetails = () => {
  const { user, isVirtualAccount, setIsVirtualAccount } = usePersonStore();
  const balance = isVirtualAccount
    ? user?.virtualBalance ?? "0.00"
    : user?.balance ?? "0.00";
  const rating = user?.rating ?? 0;
  const virtualPlayedGames = user?.virtualGameCount ?? "0";

  return (
    <div className="flex flex-col items-center text-center  text-white space-y-4 rounded-lg p-4 w-full">
      <button
        onClick={() => setIsVirtualAccount(!isVirtualAccount)}
        className=" flex gap-2 mt-3 items-center  absolute top-[70px] right-4"
      >
        {isVirtualAccount ? (
          <FiUserCheck className="text-green-400" />
        ) : (
          <FiUser className="text-gray-300" />
        )}
        <span>{isVirtualAccount ? "Virtual Mode" : "Switch to Virtual"}</span>
      </button>
      <div className="flex justify-between flex-wrap items-start w-full">
        <div className="w-full">
          <h2 className="text-xl md:text-2xl font-bold mb-4 ">
            Choose How To Play Chess:
          </h2>

          <div className="flex justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-3 text-lg font-bold">
              <span>Balance: ${balance}</span>
              <Refresh />
            </div>

            {!isVirtualAccount ? (
              <div className="flex items-center gap-3 text-lg font-bold">
                <span>Your Rating: {rating}</span>
                <Refresh />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-lg font-bold">
                <span>Virtual Games : {virtualPlayedGames}/20</span>
                <Refresh />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
