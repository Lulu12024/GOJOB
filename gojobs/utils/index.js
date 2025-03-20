export const apiUrl = "http://192.168.1.173:8000/api/";
export const imageUrl = "http://192.168.1.173:8000/"; 

export const timeAgo = (date) => {
  const now = new Date();
  const timestamp = typeof date === 'string' ? new Date(date) : date;
  const diffTime = Math.abs(now - timestamp);
  
  const minutes = Math.floor(diffTime / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    if (days === 1) return "hier";
    return `il y a ${days} jours`;
  }
  if (hours > 0) {
    return `il y a ${hours} h`;
  }
  if (minutes > 0) {
    return `il y a ${minutes} min`;
  }
  return "à l'instant"; 
};

