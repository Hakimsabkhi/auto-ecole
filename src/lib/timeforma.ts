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
  export function formatTime (time:string) {
    if (!time) return ""; // Handle empty or undefined values
    const [hours, minutes] = time.split(":");
    if (hours && minutes) {
      // Ensure hours and minutes are valid numbers
      const validHours = parseInt(hours, 10).toString().padStart(2, "0");
      const validMinutes = parseInt(minutes, 10).toString().padStart(2, "0");
      return `${validHours}:${validMinutes}`;
    }
    return "00:00"; // Default fallback
  }
  
  export function formatDatetodate(dates: string) {
    const date = new Date(dates);

    const optionss: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };

    return {
      date: date.toLocaleDateString('fr-FR', optionss),
    };
  }
    

  export const extractHour = (time: string) => {
    const [hour, minutes] = time.split(':');
    // Parse the hour to remove leading zero if present
    const formattedHour = parseInt(hour, 10);  // Converts to integer, removing leading zero
    return `${formattedHour}:${minutes}`;
  };
  export const formatDates = (isoDate: string): string => {
    const date = new Date(isoDate);
  
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
 
  