import { useEffect, useState } from "react";
import { ReportsList } from "../admin/component/report";
import { Users } from "../admin/component/users";
import fetchData  from "../admin/fetch/fetchdata";


export default function ModratorDashboard(){
    const [users, setUsers] = useState([])
    const [activeTab, setActiveTab] = useState<string>("reports");
  const [reports, setReports] = useState([]);
        
  useEffect(() => {
    async function getdata() {
      const fetchedReports = await fetchData('reports');
      const fetchedUsers = await fetchData('users');
      setReports(fetchedReports);
      setUsers(fetchedUsers)
    }

    getdata();
  }, []);

function Logout(){
  localStorage.removeItem('token')
  window.location.reload();
}



return <div className="w-[90%] m-auto">
      <button className="m-4 text-white px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-400" onClick={Logout}>Logout</button>
<div className="flex space-x-8 border-b border-gray-300 mb-6">
  <button
    className={`text-xl font-bold pb-2 ${activeTab === "reports"
        ? "text-blue-500 border-b-2 border-blue-500"
        : "text-white"
      }`}
    onClick={() => setActiveTab("reports")}
  >
    User Reports
  </button>
 
  <button
    className={`text-xl font-bold pb-2 ${activeTab === "users"
        ? "text-blue-500 border-b-2 border-blue-500"
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