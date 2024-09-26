import usePersonStore from "../contexts/auth";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useGetUser = () => {
  const updateUser = usePersonStore((state) => state.updateUser);
  const token = localStorage.getItem("token");

  useQuery({
    queryKey: ["UserDetails"],
    queryFn: async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/auth/refresh`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        });

        const user = data?.user?.user;

        if (user) {
          updateUser({ ...user, token }); // Update user state with token and user data
        } else {
          updateUser(null); // Clear user if no valid data is returned
          localStorage.removeItem("token");
        }

        return user;
      } catch (error) {
        console.error("Error fetching user:", error);
        updateUser(null); // Handle error by resetting user state
        localStorage.removeItem("token");
      }
    },
    enabled: Boolean(token),
  });

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const token = localStorage.getItem("token"); // Retrieve token from localStorage

  //     if (!token) {
  //       return; // Exit early if no token is found
  //     }

  //     try {
  //       const { data } = await axios.get(`${BACKEND_URL}/auth/refresh`, {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`, // Send token in Authorization header
  //         },
  //       });

  //       const user = data?.user?.user;

  //       if (user) {
  //         updateUser({ ...user, token }); // Update user state with token and user data
  //       } else {
  //         updateUser(null); // Clear user if no valid data is returned
  //         localStorage.removeItem("token");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user:", error);
  //       updateUser(null); // Handle error by resetting user state
  //       localStorage.removeItem("token");
  //     }
  //   };

  //   fetchUser(); // Call the async function immediately after defining it
  // }, [updateUser]); // Dependency array to prevent unnecessary re-renders
};
