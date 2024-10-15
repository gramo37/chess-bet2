import { useEffect } from "react";
import Admin from "../components/admin"
import { useChatStore } from "../contexts/auth";

const Dashboard = () => {
    const {setChatVisibility} = useChatStore()

    useEffect(()=>{
    setChatVisibility(false)
    },[])

    return <Admin />
}

export default Dashboard;