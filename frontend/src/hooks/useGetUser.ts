import { useEffect } from "react";
import usePersonStore from "../contexts/auth";
import { BACKEND_URL } from "../constants/routes";
import axios from "axios";

export const useGetUser = () => {
  const updateUser = usePersonStore((state) => state.updateUser);
  const setIsLoading = usePersonStore((state) => state.setIsLoading);
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) { return }
        setIsLoading(true)
        const response = await axios.get(`${BACKEND_URL}/auth/refresh`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` // Attach token in the Authorization header
          }
        });
        if (response.data.user) {
          console.log(response.data.user);
          updateUser(response.data.user); // Update user state with the response data
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        updateUser(null); // Set user as null if there was an error
      } finally {
        setIsLoading(false);
      }
    })();
  }, [setIsLoading, updateUser]);
};
