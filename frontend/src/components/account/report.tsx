import { useState } from "react";
import { TbMessageReportFilled } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import { BACKEND_URL } from "../../constants/routes";

export function Report() {
  const [isOpen, setIsOpen] = useState(false);
const [email,setEmail]=useState("");
const [description,setDescription]=useState("");
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  
  function Submit(){
if(!email||!description){
alert("Enter All details");
return;
}


  }


  return ( isOpen?<div className="w-full h-screen relative bg-transparent">
      

          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={closeModal}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full relative">
              <h1 className="text-2xl font-semibold text-gray-800 mb-6 ">
                Report an Issue
              </h1>

              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
              >
                <IoClose/>
              </button>

              <div className="mb-4">
               
                <input
                  type="email"
                  placeholder="Your Email"
                  onChange={(e)=>setEmail(e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div className="mb-6">
                
                <textarea
                  placeholder="Enter your issue here..."
                  rows={4}
                  onChange={(e)=>setDescription(e.target.value)}
                  className="w-full px-4 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <button onClick={Submit} className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                Submit
              </button>
            </div>
          </div>
    </div>: <button
        onClick={openModal}
        className="absolute top-4 right-4 flex items-center gap-2 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
      >
        Report <TbMessageReportFilled/>
      </button>)
  
}
