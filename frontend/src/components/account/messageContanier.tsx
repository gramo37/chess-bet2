import { useEffect, useState } from "react";
import { BACKEND_URL } from "../../constants/routes";
import usePersonStore from "../../contexts/auth";

type MessageContainerReportProps = {
    setOpenMessageReportId: React.Dispatch<React.SetStateAction<string | null>>;
    openMessageReportId: string | null;
};

export const MessageContainerReport = ({ setOpenMessageReportId, openMessageReportId }: MessageContainerReportProps) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<any[]>([]); // To store the fetched messages
    const [error, setError] = useState<string | null>(null);
    const user = usePersonStore((state) => state.user);
    // Fetch messages when the component is mounted
    useEffect(() => {
        const fetchMessages = async () => {
            if (!openMessageReportId) return;
            try {
                const url = `${BACKEND_URL}/report/get-report-messages/${openMessageReportId}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setMessages(data.messages);
                } else {
                    setError(data.message || "Error fetching messages");
                }
            } catch (e: any) {
                console.error("Error fetching messages:", e);
                setError("Failed to fetch messages");
            }
        };

        fetchMessages();
    }, [openMessageReportId]);

    const sendMessage = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!input || !openMessageReportId) return;

        try {
            const url = `${BACKEND_URL}/report/send-report-message/${openMessageReportId}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ content: input }),
            });
            const data = await response.json();

            if (response.ok) {
                setMessages((prevMessages) => {
                    return [...prevMessages, data.messageData];
                });
                setInput(""); // Clear the input field
                alert(data.message || "Message Sent");

            } else {
                alert(data.message || "Failed to send message");
            }
        } catch (e: any) {
            console.error("Error sending message:", e);
            alert(e.message || "An error occurred while sending the message.");
        }
    };

    if(error) return <p className="text-red-500">{error}</p>
     
    async function Completed() {
        const id = openMessageReportId
        const url = `${BACKEND_URL}/admin/reportscomplete/${id}`;
    
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
          console.log(data)
          alert(data.message??"Marked as resolved")
          window.location.reload()
        } catch (error) {
          console.error("Error completing the report:", error);
        }
      }
    
    


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="max-w-[97%] w-[500px]">
            <div className="relative rounded-lg  h-auto   p-1 ">
                <div
                    id="message-container"
                    className="h-[400px] overflow-y-auto relative bg-gray-100 text-black rounded-lg mb-4 px-4 py-3"
                >
                    
                    <div className="w-full grid pb-11">
                    {(user&&user.role!=='USER')&&<button className="px-3 py-1  bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-all duration-200 w-full md:w-auto mb-3" onClick={Completed} >Resolved</button>}

                        <div className="grid">
                                {
                                    messages.map((msg, index) => (
                                        (msg.sender === 'USER') ? (<div
                                            key={index}
                                            className={`className="px-3.5 py-2 bg-gray-300  mb-3 whitespace-nowrap p-2 rounded`}
                                        >
                                            <h5 className="text-yellow-900 text-sm font-semibold leading-snug capitalize pb-1">{msg.sender.toLowerCase()}</h5>
                                            <h5 className="text-gray-900 text-sm font-normal leading-snug"> {msg.message}</h5>
                                        </div>) : <div
                                            key={index}
                                            className={`className="px-3.5 py-2 bg-gray-300  mb-3 whitespace-nowrap p-2 rounded`}
                                        >
                                            <h5 className="text-yellow-900 text-sm font-semibold leading-snug capitalize pb-1">{msg.sender.toLowerCase()}</h5>
                                            <h5 className="text-gray-900 text-sm font-normal leading-snug"> {msg.message}</h5>
                                        </div>)
                                    
                                    )}
                        </div>
                    </div>
                </div>
               
                <button
                className="absolute top-0 right-2 text-black text-2xl hover:text-gray-800"
                onClick={() => {
                    setOpenMessageReportId(null); // Close the message tab
                }}
            >
                &times;
            </button>
            </div>


            {/* Input Form */}
            <form id="send-container" className="flex" onSubmit={sendMessage}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-l-lg"
                    placeholder="Type your message"
                />
                <button
                    type="submit"
                    className="bg-yellow-500 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded-r-lg"
                >
                    Send
                </button>
            </form>

           
        </div>
        </div>
    );
};
