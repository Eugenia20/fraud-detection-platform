export const formatCurrency = (amount, currency = 'USD') => {
  const currencySymbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    RUB: '₽',
    INR: '₹',
    BRL: 'R$',
    CAD: 'C$',
    AUD: 'A$'
  };

  const symbol = currencySymbols?.[currency?.toUpperCase()] || currency;
  const formattedAmount = amount?.toLocaleString('en-US', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  });

  return `${symbol}${formattedAmount}`;
};

export const getCurrencyOptions = () => [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'JPY', label: 'JPY - Japanese Yen' },
  { value: 'CNY', label: 'CNY - Chinese Yuan' },
  { value: 'RUB', label: 'RUB - Russian Ruble' },
  { value: 'INR', label: 'INR - Indian Rupee' },
  { value: 'BRL', label: 'BRL - Brazilian Real' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
  { value: 'AUD', label: 'AUD - Australian Dollar' }
];

export default formatCurrency;