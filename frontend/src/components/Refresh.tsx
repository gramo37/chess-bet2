import { useQueryClient } from "@tanstack/react-query";
import { IoMdRefresh } from "react-icons/io";

const Refresh = () => {
  const qc = useQueryClient();
  const refresh = () => {
    qc.invalidateQueries({
      queryKey: ["UserDetails"],
    });
  };
  return (
    <button onClick={refresh}>
      <IoMdRefresh size={20}/>
    </button>
  );
};

export default Refresh;
