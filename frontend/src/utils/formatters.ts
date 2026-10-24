/**
 * FinPath Centralized Currency & Number Formatting Utility (INR / en-IN)
 */

export const formatCurrency = (
  amount: number | null | undefined,
  currency = 'INR'
): string => {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return '—';
  }

  const isWhole = amount % 1 === 0;

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatNumber = (
  amount: number | null | undefined
): string => {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return '0';
  }

  const isWhole = amount % 1 === 0;

  return new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatCompactCurrency = (
  amount: number | null | undefined,
  currency = 'INR'
): string => {
  if (amount === null || amount === undefined || !Number.isFinite(amount)) {
    return '—';
  }

  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (abs >= 10000000) {
    // Crores
    const cr = abs / 10000000;
    return `${sign}₹${cr % 1 === 0 ? cr : cr.toFixed(1)}Cr`;
  }
  if (abs >= 100000) {
    // Lakhs
    const l = abs / 100000;
    return `${sign}₹${l % 1 === 0 ? l : l.toFixed(1)}L`;
  }
  if (abs >= 1000) {
    // Thousands
    const k = abs / 1000;
    return `${sign}₹${k % 1 === 0 ? k : k.toFixed(1)}k`;
  }

  return formatCurrency(amount, currency);
};
