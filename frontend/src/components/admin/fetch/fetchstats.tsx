import {BACKEND_URL} from "../../../constants/routes"

export async function fetchedStatsData( date: Date | null) {
    // Build the URL with or without the startDate query parameter
    let url = `${BACKEND_URL}/admin/stats/`;
    if (date) {
      const formattedDate = date.toISOString(); // Convert date to ISO format
      url += `?startDate=${formattedDate}`; // Append the date to the URL as a query parameter
    }
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (response.status === 400) {
        throw new Error(`Error fetching stats.`);
      } else if (response.status >= 500) {
        throw new Error('Internal server error. Please try again later.');
      }
  
      const data = await response.json();
      console.log(`$status fetched:`, data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      alert(`Error fetching stats for status`);
    }
  }
  