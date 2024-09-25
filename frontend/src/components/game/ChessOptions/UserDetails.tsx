import usePersonStore from "../../../contexts/auth";

const UserDetails = () => {
  const user = usePersonStore((state) => state.user);
  return (
    <>
      <h2 className="text-white text-2xl font-bold">
        Choose how to play chess:
      </h2>
      <h2 className="text-white text-xl font-bold">
        Balance: {user?.balance ?? 0} $
      </h2>
      <h2 className="text-white text-lg font-bold mb-4">
        Your Rating: {user?.rating ?? 0}
      </h2>
    </>
  );
};

export default UserDetails;
