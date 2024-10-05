import usePersonStore from "../../../contexts/auth";
import Refresh from "../../Refresh";

const UserDetails = () => {
  const user = usePersonStore((state) => state.user);
  return (
    <>
      <h2 className="text-white text-2xl font-bold">
        Choose how to play chess:
      </h2>
      <div className="flex text-white gap-3 justify-around items-center">
        <h2 className="text-white text-xl font-bold">
          Balance: $
          {user?.balance && !Number.isNaN(Number(user?.balance))
            ? Number(user?.balance).toFixed(2)
            : 0}
        </h2>
        <Refresh />
      </div>
      <div className="flex text-white gap-2 justify-around items-center mb-4">
        <h2 className="text-white text-lg font-bold">
          Your Rating: {user?.rating ?? 0}
        </h2>
        <Refresh />
      </div>
    </>
  );
};

export default UserDetails;
