import { useEffect, useState } from "react";
import { ReportsList } from "../admin/component/report";
import { Users } from "../admin/component/users";
import fetchData  from "../admin/fetch/fetchdata";
import { useChatStore } from "../../contexts/auth";


export default function ModratorDashboard(){
    const [users, setUsers] = useState([])
    const [activeTab, setActiveTab] = useState<string>("reports");
  const [reports, setReports] = useState([]);
  const { setChatVisibility } = useChatStore();      
  useEffect(() => {
    async function getdata() {
      const fetchedReports = await fetchData('reports');
      const fetchedUsers = await fetchData('users');
      setReports(fetchedReports);
      setUsers(fetchedUsers)
      setChatVisibility(false);
    }

    getdata();
  }, []);


return <div className="w-[90%] m-auto">
<div className="flex space-x-8 border-b border-gray-300 my-6">
  <button
    className={`text-xl font-bold pb-2 ${activeTab === "reports"
        ? "text-yellow-600 border-b-2 border-yellow-600"
        : "text-white"
      }`}
    onClick={() => setActiveTab("reports")}
  >
    User Reports
  </button>
 
  <button
    className={`text-xl font-bold pb-2 ${activeTab === "users"
        ? "text-yellow-600 border-b-2 border-yellow-600"
        : "text-white"
      }`}
    onClick={() => setActiveTab("users")}
  >
    Users
  </button>
  
</div>

{/* Tabs Content */}
<div>
  {activeTab === "reports" && <ReportsList reports={reports} />}
  
  {activeTab === "users" && <Users users={users} />}
</div>
</div>
}