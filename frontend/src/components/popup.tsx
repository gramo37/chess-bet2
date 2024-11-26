import { useGlobalStore } from "../contexts/global.context";

export default function PopUp() {
  const { popUpDetails, alertPopUp } = useGlobalStore([
    "popUpDetails",
    "alertPopUp",
  ]);

  if (!popUpDetails.showPopUp) return null;
  const closeModal = () => {
    alertPopUp({
      message: "",
      type: "info",
      showPopUp: false,
    });
  };

  return (
    <div
      id="popup-modal"
      className={`fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-black bg-opacity-50`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-max p-6">
        <div className="bg-white rounded-lg shadow-lg dark:bg-zinc-900">
          {/* Header */}
          <header className="flex justify-between items-center p-4 gap-10 ">
            <h3
              id="modal-title"
              className="text-xl font-bold text-gray-800 dark:text-gray-100"
            >
              {popUpDetails.message || "Notification"}
            </h3>
            <button
              type="button"
              onClick={closeModal}
              className="text-gray-500 hover:bg-gray-200 hover:text-gray-800 rounded-full text-sm w-8 h-8 inline-flex items-center justify-center dark:hover:bg-gray-700 dark:hover:text-gray-200"
              aria-label="Close modal"
            >
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </header>

          {/* Body */}
          {popUpDetails.body && (
            <main className="p-4 text-gray-700 dark:text-gray-300 border-t border-gray-200 dark:border-gray-700">
              {popUpDetails.body || "Hello, world!"}
            </main>
          )}

          {/* Footer */}
          {popUpDetails.type === "confirm" && (
            <footer className="flex justify-end gap-4 p-4">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                onClick={async () => {
                  await popUpDetails.success();
                  closeModal();
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                onClick={() => {
                  popUpDetails.failure();
                  closeModal();
                }}
              >
                No
              </button>
            </footer>
          )}
        </div>
      </div>
    </div>
  );
}
