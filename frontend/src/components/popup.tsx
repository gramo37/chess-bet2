import { useState } from "react";

type PopupProps = {
    title:string,
} 

export default function PopUp({title}:PopupProps){
    const [show,setShow]=useState(true)
    if (!show) return null; // Don't render the modal if it's not shown

    return (
        <div
            id="popup-modal"
            className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50"
            aria-modal="true"
            role="dialog"
            aria-labelledby="modal-title"
            aria-hidden={!show}
        >
            <div className="relative w-full max-w-[250px] p-4">
                <section className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                    <header className="flex justify-between items-center p-4 border-b dark:border-gray-600">
                        <h3 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        <button
                            type="button"
                            onClick={() => {
                                setShow(false)
                              window.location.reload()
                            }}
                            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                            aria-label="Close modal"
                        >
                            <svg
                                className="w-4 h-4"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7l-6 6"
                                />
                            </svg>
                        </button>
                    </header>
                </section>
            </div>
        </div>
    );
}