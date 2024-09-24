import { BACKEND_URL } from "../../constants/routes";


  
  export async function fetchData(type:string){
  //fetch transactions, games,reports, users,etc
    const url = `${BACKEND_URL}/admin/${type}`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
        },
      });
  
      if (response.status === 400) {
        throw new Error(`Error fetching ${type}.`);
      } else if (response.status >= 500) {
        throw new Error('Internal server error. Please try again later.');
      }
  
      const data = await response.json();
      console.log(`${type} fetched:`, data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert(`Error fetching ${type}`);
    }
  }


export async function updateUser(type:string,id:string,a:number = 0 ){
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