
const formatMoney = (value: number): string => {
    if (typeof value !== 'number' || isNaN(value)) {
        return '$0.00';
    }
    return value.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });
}

export default formatMoney;