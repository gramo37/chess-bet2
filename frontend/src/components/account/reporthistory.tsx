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
        <div className=" shadow-md rounded-lg">
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
  
  return <div
  key={report.id}
  className="p-2 md:p-4 bg-white mb-2 hover:bg-yellow-50 transition-colors rounded-lg shadow-sm border border-gray-200 "
>
  {/* Top section: Title and Reporter info */}
  <div className="flex justify-between items-start md:items-center">
    <div className="flex-1">
      <h3 className="font-semibold capitalize text-base md:text-lg text-gray-900 mb-2 break-words">
        {report.title}
      </h3>
    </div>

    <div className="ml-4 text-right text-sm md:text-base">
      <p className="text-gray-500 mb-1">
        Status:{" "}
        <span className={report.status === "PENDING" ? "text-red-500" : "text-green-500"}>
          {report.status}
        </span>
      </p>
      <p className="text-gray-500 text-xs md:text-sm">
        Created At: {new Date(report.createdAt).toLocaleString()}
      </p>
    </div>
  </div>

  {/* Description and Buttons */}
  <div className="mt-1">
    <p className="text-gray-700 text-sm md:text-base break-words">
      {report.description}
    </p>
    
    {/* Conditional Message Tab */}
    {report.status === "PENDING" && (
      <button
        className="mt-3 text-yellow-600 text-sm hover:underline"
        onClick={() =>
          setOpenMessageReportId(
            openMessageReportId === report.id ? null : report.id
          )
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