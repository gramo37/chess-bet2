import { BACKEND_URL } from "../../../constants/routes";

type Report = {
    id: string;
    title: string;
    description: string;
    user: {
      name: string;
      email: string; // Added email to user
      id: string;    // Added user ID
    };
    createdAt: string; // Timestamp of when the report was created
    status: string; 
  };
  
// ReportsList Component
type ReportsListProps = {
    reports: Report[];
  };
  
  export const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
    if (!reports || reports.length === 0)
      return <p className="text-gray-600">No Reports found </p>;
  
    async function Completed(id: string) {
      const url = `${BACKEND_URL}/admin/reports/${id}/complete`;
    
      try {
        const response = await fetch(url, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          }
        });
    
        if (!response.ok) {
          throw new Error(`Failed to mark report ${id} as completed`);
        }
    
        const data = await response.json();
        console.log("Report marked as completed:", data);
      } catch (error) {
        console.error("Error completing the report:", error);
      }
    }
  
    return (
      <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="bg-white p-3 rounded-md shadow-md">
          <h3 className="font-semibold text-lg text-gray-800">{report.title}</h3>
          <p className="text-gray-700">{report.description}</p>
  
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">Reported by:</span>
              <span className="font-medium text-gray-800">{report.user.name}</span>
              <a  className="text-sm text-gray-600 hover:underline" href={`mailto:${report.user.email}`}target="_blank" rel="noopener noreferrer">{report.user.email}</a>
  
            </div>
            <div className="mt-2 border-l border-gray-200 pl-4">
              {(report.status==='PENDING')&&<button onClick={()=>Completed(report.id)} className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2 hover:bg-blue-400 transition duration-200">
                Mark as completed
              </button>}
              <p className="text-sm text-gray-600">
                Status: <span className={report.status === "COMPLETED" ? "text-green-600" : "text-red-600"}>{report.status}</span>
              </p>
              <p className="text-xs text-gray-500">Created At: {new Date(report.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    );
  };
  