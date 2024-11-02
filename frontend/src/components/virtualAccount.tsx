import { Chessboard } from "react-chessboard";

export default function VirtualAccount() {
  return (
    <div className="w-full bg-black text-white min-h-screen flex flex-col items-center">
      <h1 className="text-3xl font-bold my-4">Virtual Account</h1>
      <div className="flex gap-2">
        {/* <div className=""> */}
        <Chessboard />
        {/* </div> */}
        <div>Balance</div>
      </div>
    </div>
  );
}
