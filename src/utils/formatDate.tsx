// const formatDate = (dateString: string): string => {
//     return new Date(dateString).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
// }

// export default formatDate;

const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0 a 11
    const year = date.getFullYear();
  
    return `${day}/${month}/${year}`;
  };
  
  export default formatDate;
  