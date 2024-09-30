import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
import Spinner from "../spinner";

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

  if (loading) return <Spinner/>;
  if (error) return <p>{error}</p>;

  return (<div className="container mx-auto px-4 py-8">
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
                <h3 className="font-bold mb-2 text-gray-800">{report.title}</h3>
                <p className="text-gray-600 mb-2">{report.description}</p>
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
