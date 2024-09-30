import { BACKEND_URL } from "../../../constants/routes";

export default async function updateUser(type:string,id:string,a:number = 0 ){
    const url = `${BACKEND_URL}/admin/users/${id}/${type}`;
    
    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body:JSON.stringify({amount:a})
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update the ${type}`);
      }
  
      const data = await response.json();
      alert(data.message);
      console.log(`Update the ${type}`, data);
    } catch (error) {
      console.error(`Error updating the ${type}`, error);
    }
  }
  