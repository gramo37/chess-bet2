import usePersonStore from "../../../contexts/auth";
import Refresh from "../../Refresh";

const UserDetails = () => {
  const { user, isVirtualAccount } = usePersonStore();
  const balance = isVirtualAccount
    ? user?.virtualBalance ?? "0.00"
    : user?.balance ?? "0.00";
  const rating = user?.rating ?? 0;

  return (
    <div className="flex flex-col items-center text-center text-white space-y-4 rounded-lg p-4 w-full">
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        Choose How To Play Chess:
      </h2>

      <div className="flex items-center gap-3 text-lg font-bold">
        <span>Balance: ${balance}</span>
        <Refresh />
      </div>

      {!isVirtualAccount && (
        <div className="flex items-center gap-3 text-lg font-bold">
          <span>Your Rating: {rating}</span>
          <Refresh />
        </div>
      )}
    </div>
  );
};

export default UserDetails;
