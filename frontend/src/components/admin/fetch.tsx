import { BACKEND_URL } from "../../constants/routes";

export async function fetchReports() {
    const url = `${BACKEND_URL}/admin/reports`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Ensure the token is passed
        },
      });
  
      if (response.status === 400) {
        throw new Error('Error fetching reports.');
      } else if (response.status >= 500) {
        throw new Error('Internal server error. Please try again later.');
      }
  
      const data = await response.json();
      console.log('Reports fetched:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching reports');
    }
  }
  
 export async function fetchTransactions() {
    const url = `${BACKEND_URL}/admin/transactions`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token for authorization
        },
      });
  
      if (response.status === 400) {
        throw new Error('Error fetching transactions.');
      } else if (response.status >= 500) {
        throw new Error('Internal server error. Please try again later.');
      }
  
      const data = await response.json();
      console.log('Transactions fetched:', data);
  
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching transactions');
    }
  }
  
  export async function fetchGames() {
    const url = `${BACKEND_URL}/admin/games`;
  
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Token for authorization
        },
      });
  
      if (response.status === 400) {
        throw new Error('Error fetching games.');
      } else if (response.status >= 500) {
        throw new Error('Internal server error. Please try again later.');
      }
  
      const data = await response.json();
      console.log('Games fetched:', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert('Error fetching games');
    }
  }
  