import { useState } from "react";
import { TbMessageReportFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";

type ReportProps = {
  token: string;
};

export function Report({ token }: ReportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  async function Submit() {
    if (!token) {
      alert("Please login again.");
      return;
    }

    if (!title || !description) {
      alert("Please provide both title and description.");
      return;
    }

    const url = `${BACKEND_URL}/report/create-report`;

    try {
      const response = await axios.post(
        url,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message);
      closeModal();
    } catch (error: any) {
      if (error.response) {
        alert(`Error: ${error.response.data.message}`);
      } else {
        console.error("Error creating report:", error);
        alert("Something went wrong, please try again later.");
      }
    } finally {
      setTitle("");
      setDescription("");
    }
  }

  return isOpen ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 transition-opacity">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full relative">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Report an Issue</h1>

        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          onClick={closeModal}
        >
          <IoClose className="text-2xl" />
        </button>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
          />
        </div>

        <div className="mb-6">
          <textarea
            placeholder="Describe the issue..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 border text-gray-800 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 transition duration-200"
          />
        </div>

        <button
          onClick={Submit}
          className="w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors duration-200"
        >
          Submit Report
        </button>
      </div>
    </div>
  ) : (
    <button
      onClick={openModal}
      className="flex items-center gap-2 bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
    >
      <TbMessageReportFilled className="text-xl" />
    </button>
  );
}
