import { useEffect } from "react";
import Account from "../components/account";
import { useChatStore } from "../contexts/auth";

const AccountPage = () => {
  
  
const { setChatVisibility, isTawkLoaded } = useChatStore();
  
  useEffect(() => {
    setChatVisibility(false);
    return () => {
      setChatVisibility(true);
    }
}, [isTawkLoaded, setChatVisibility]);
  
  
  return <Account />;
};

export default AccountPage;
