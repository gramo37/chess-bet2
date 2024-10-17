import usePersonStore from "../../../contexts/auth";
import Refresh from "../../Refresh";

const UserDetails = () => {
  const user = usePersonStore((state) => state.user);
  return (
    <>
      <h2 className="text-white text-2xl font-bold">
        Choose How To Play Chess:
      </h2>
      <div className="inline-flex text-white gap-3 ">
        <h2 className="text-white text-xl font-bold">
          Balance: $
          {user?.balance && !Number.isNaN(Number(user?.balance))
            ? Number(user?.balance).toFixed(2)
            : 0}
        </h2>
        <Refresh />
      </div>
      <div className="inline-flex text-white gap-2  mb-4">
        <h2 className="text-white text-lg font-bold">
          Your Rating: {user?.rating ?? 0}
        </h2>
        <Refresh />
      </div>
    </>
  );
};

export default UserDetails;
