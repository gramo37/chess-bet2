import { BACKEND_URL } from "../../../constants/routes";

export default async function fetchPlayer(id:string) {
    const url = `${BACKEND_URL}/admin/userprofile/${id}`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure the token is passed
        },
      });
      if (!response.ok) {
        throw new Error("Player not found");
      }
      const data = await response.json();
      console.log(data);
      return data;
    }catch(e:any){
    console.log('error',e);
    return e;
    }
}