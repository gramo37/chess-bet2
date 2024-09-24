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

type UserReportsProps = {
  token: string;
  openModal:()=>void;
};

export function ReportHistory({ token,openModal }: UserReportsProps) {
  const [reports, setReports] = useState<UserReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchReports = async () => {
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
  }, [token,openModal]);

  if (loading) return <Spinner/>;
  if (error) return <p>{error}</p>;

  return (
    <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md max-w-md w-full">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Your Reports</h2>
      {reports.length === 0 ? (
        <p className="text-gray-500">No reports found.</p>
      ) : (
        <ul className="space-y-4">
          {reports.map((report) => (
            <li
              key={report.id}
              className="border border-gray-300 rounded-md p-4 bg-white hover:shadow-lg transition-shadow"
            >
              <h3 className="font-bold text-gray-800">{report.title}</h3>
              <p className="text-gray-600">{report.description}</p>
              <p className="text-gray-500 text-sm">
                Status: <span className="font-medium">{report.status}</span> | Created at:{" "}
                <span className="font-medium">{new Date(report.createdAt).toLocaleString()}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
