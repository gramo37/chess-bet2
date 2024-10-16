import { useEffect } from "react";
import Account from "../components/account";
import { useChatStore } from "../contexts/auth";

const AccountPage = () => {
  const { setChatVisibility } = useChatStore();
  useEffect(() => {
    setChatVisibility(false);
    return () => {
      setChatVisibility(true);
    };
  }, []);

  return <Account />;
};

export default AccountPage;
