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
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login again.");
        setLoading(false);
        return;
      }

      const url = `${BACKEND_URL}/report/user-reports`;

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


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="overflow-x-auto">
        <div className="bg-white border border-gray-200 shadow-md rounded-lg">
          {reports.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No reports found.</div>
          ) : (
            <div className="divide-y divide-gray-200">
              {reports.map((report) => (
                <Report report={report} openMessageReportId={openMessageReportId ?? ""} setOpenMessageReportId={setOpenMessageReportId} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type ReportProps = {
  report: any,
  openMessageReportId: string,
  setOpenMessageReportId: (arg: any) => void
}


const Report = ({ report, openMessageReportId, setOpenMessageReportId }: ReportProps) => {
  async function Completed(id: string) {
    const url = `${BACKEND_URL}/report/${id}/complete`;

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
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


  return <div
    key={report.id}
    className="p-4 hover:bg-yellow-50 text-left transition-colors"
  >
    <div className="flex justify-between">
      <div>
      <h3 className="font-bold text-sm text-gray-900 mb-2">{report.title}</h3>
      <p className="text-gray-500 mb-1 text-xs">
          <span>Created at: </span>
          <span className="">
            {new Date(report.createdAt).toDateString()}
          </span>
        </p>
      </div>

      <div className="text-right text-sm">
        <p className="text-gray-500 mb-1">
    Status: {report.status}</p>
        {report.status === "PENDING" && (
          <button
            onClick={() => Completed(report.id)}
            className="px-2 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
          >
            Resolved
          </button>
        )}
      </div>
    </div>

    <div>
      <p className="text-gray-700 mb-2">{report.description}</p>
      {report.status === "PENDING" && (
        <button
          className="text-yellow-600 hover:underline"
          onClick={() =>
            setOpenMessageReportId(openMessageReportId === report.id ? null : report.id)
          }
        >
          {openMessageReportId === report.id
            ? "Close message tab"
            : "Open message tab"}
        </button>
      )}
      {openMessageReportId === report.id && (
        <MessageContainerReport
          setOpenMessageReportId={setOpenMessageReportId}
          openMessageReportId={openMessageReportId}
        />
      )}
    </div>
  </div>
}