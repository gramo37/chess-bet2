import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import Spinner from "../spinner";
import { MessageContainerReport } from "./messageContanier";

type UserReport = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export function ReportHistory() {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openMessageReportId, setOpenMessageReportId] = useState<string | null>(null);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Login again");
        setLoading(false);
        return;
      }

      const url = `${BACKEND_URL}/report/user-reports`; // Adjust this URL as needed

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReports(response.data.reports);
      } catch (error: any) {
        console.error("Error fetching reports:", error);
        setError("Unable to fetch reports, please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <Spinner />;
  if (error) return <p>{error}</p>;

  async function Completed(id: string) {
    const url = `${BACKEND_URL}/report/${id}/complete`;
  
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
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <div className="bg-white border border-gray-200 shadow-md">
          {reports.length === 0 ? (
            <div className="p-4 text-left text-gray-500">No reports found.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 hover:bg-gray-50 text-left transition-colors flex capitalize justify-between"
                >
                  <div>
                    <h3 className="font-bold mb-1 text-gray-800">{report.title}</h3>
                    <p className="text-gray-600 mb-1">{report.description}</p>
                    {report.status === "PENDING" && (
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() =>
                          setOpenMessageReportId(openMessageReportId === report.id ? null : report.id)
                        }
                      >
                        {openMessageReportId === report.id ? "Close message tab" : "Open message tab"}
                      </button>
                    )}
                    {openMessageReportId === report.id && (
                      <MessageContainerReport setOpenMessageReportId={setOpenMessageReportId} openMessageReportId={openMessageReportId} />
                    )}
                  </div>
                  <div className="text-gray-500 text-sm text-right">
                    <p className="mb-2">
                      <span>Status: </span>
                      <span className="font-medium">{report.status}</span>
                    </p>
                    <p className="mb-2">
                      <span>Created at: </span>
                      <span className="font-medium">
                        {new Date(report.createdAt).toLocaleString()}
                      </span>
                    </p>
                    {report.status === "PENDING" && (
                      <button
                        onClick={() => Completed(report.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg mb-2 hover:bg-blue-400 transition duration-200"
                      >
                        Mark as completed
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

