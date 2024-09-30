import { BACKEND_URL } from "../../../constants/routes";

export default async  function bannedUser (id:string,message:string){
    const url = `${BACKEND_URL}/admin/users/${id}`;
  
    try {
      const token = localStorage.getItem("token"); // Assuming JWT token is stored in localStorage
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body:JSON.stringify({message})
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete user");
      }
  const data = await response.json();
      alert(data.message);
  
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      console.error("Error banning user:", error);
    }}