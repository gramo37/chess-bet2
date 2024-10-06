import { useState } from "react";
import { ReportsListProps } from "../schema";
import { MessageContainerReport } from "../../account/messageContanier";

  export const ReportsList: React.FC<ReportsListProps> = ({ reports }) => {
    if (!reports || reports.length === 0)
      return <p className="text-gray-600">No Reports found </p>;
    const [openMessageReportId, setOpenMessageReportId] = useState<string | null>(null);
  
    return (
      <div className="space-y-4">
      {reports.map((report) => (
        <div key={report.id} className="bg-white p-3 rounded-md shadow-md">
          <div className="flex justify-between items-center">
            <div>
          <h3 className="font-semibold text-lg text-gray-800">{report.title}</h3>
          <p className="text-gray-700">{report.description}</p>
          {report.status === "PENDING" && (
                      <button
                        className="text-yellow-600 hover:underline"
                        onClick={() =>
                          setOpenMessageReportId(openMessageReportId === report.id ? null : report.id)
                        }
                      >
                        {openMessageReportId === report.id ? "Close message tab" : "Open message tab"}
                      </button>
                    )}
                    {openMessageReportId === report.id && (
                      <MessageContainerReport openMessageReportId={openMessageReportId} setOpenMessageReportId={setOpenMessageReportId} />
                    )}
  </div>
            <div className="">
              <p className="font-medium text-gray-800"><span className="text-sm text-gray-600">Reported by:</span> {report.user.name}</p>
              <a  className="text-sm text-gray-600 hover:underline" href={`mailto:${report.user.email}`}target="_blank" rel="noopener noreferrer">{report.user.email}</a>
              <p className="text-sm text-gray-600 mt-2">
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
  