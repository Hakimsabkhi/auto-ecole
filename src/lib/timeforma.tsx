export const formatDate = (date:string) => {
    const formattedDate = new Date(date);
  
    // Get the individual components of the date and time
    const year = formattedDate.getFullYear();
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Ensure 2-digit month
    const day = String(formattedDate.getDate()).padStart(2, '0'); // Ensure 2-digit day
    const hours = String(formattedDate.getHours()).padStart(2, '0'); // Ensure 2-digit hour
    const minutes = String(formattedDate.getMinutes()).padStart(2, '0'); // Ensure 2-digit minutes
  
    // Format to YYYY-MM-DD HH:mm
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };
  