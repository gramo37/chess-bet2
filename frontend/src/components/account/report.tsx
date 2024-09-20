import {  useState } from "react";
import { TbMessageReportFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";
// import {ReportHistory} from "../account/reporthistory";
type ReportProps = {
  token: string;
};

export function Report({token}:ReportProps) {
  const [isOpen, setIsOpen] = useState(false);
const [title,setTitle]=useState("");
const [description,setDescription]=useState("");
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  async function Submit() {
    if(!token){
alert("Login again")
return;
    }
    if (!title || !description) {
      alert("Enter all details");
      return;
    }
  
    const url = `${BACKEND_URL}/report/create-report`;
  
    try {
      const response = await axios.post(url, {
        title,
        description,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,}
      });
  
      alert(response.data.message);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      if (error.response) {
        // Server responded with a status other than 2xx
        alert(`Error: ${error.response.data.message}`);
      } else {
        // Network error or other error
        console.error("Error creating report:", error);
        alert("Something went wrong, please try again later.");
      }
    }
  }
  

  return (
    isOpen ? (
      <div className="w-full h-full relative bg-transparent overflow-auto">
  
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-70">
          
          <div className="bg-white p-10 rounded-lg shadow-lg max-w-md w-full relative transition-transform transform duration-300 ease-in-out">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Report an Issue
            </h1>
  
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              onClick={closeModal}
            >
              <IoClose className="text-xl" />
            </button>
  
            <div className="mb-4">
              <input
                type="text"
                placeholder="Your title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
  
            <div className="mb-6">
              <textarea
                placeholder="Enter your issue here..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
              />
            </div>
  
            <button 
              onClick={Submit} 
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
            >
              Submit
            </button>
          </div>
  
          {/* <ReportHistory token={token} openModal={openModal} /> */}
        </div>
  
      </div>
    ) : (
      <button
        onClick={openModal}
        className="absolute top-4 right-4 flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Report <TbMessageReportFilled />
      </button>
    )
  );
  
  
}
