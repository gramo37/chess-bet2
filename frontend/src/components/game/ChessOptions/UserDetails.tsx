import usePersonStore from "../../../contexts/auth";
import Refresh from "../../Refresh";

const UserDetails = () => {
  const user = usePersonStore((state) => state.user);

  return (
    <div className="flex flex-col items-center text-center text-white space-y-2 rounded-lg p-4 w-full">
      <h2 className="text-xl md:text-2xl font-bold whitespace-nowrap mb-2">
        Choose How To Play Chess:
      </h2>
      <div className="inline-flex gap-3 text-lg">
        <h2 className="font-bold">
          Balance: ${user?.balance ? user.balance : "0.00"}
        </h2>
        <Refresh />
      </div>
      <div className="inline-flex gap-3 text-lg">
        <h2 className="font-bold">Your Rating: {user?.rating ?? 0}</h2>
        <Refresh />
      </div>
    </div>
  );
};

export default UserDetails;
