const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default formatDate;