
export const fmt = (n: number) =>
  `₱${n.toLocaleString('en-PH', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  })}`;

export const fmtD = (d: string) => {
  if (!d) return 'N/A';
  const date = new Date(d);
  return isNaN(date.getTime()) 
    ? 'INVALID DATE' 
    : date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
};

export function calcDeductions(monthly: number) {
  const sss        = monthly * 0.045;
  const pagibig    = monthly <= 1500 ? monthly * 0.01 : Math.min(monthly * 0.02, 100);
  const philhealth = monthly * 0.025;
  const total      = sss + pagibig + philhealth;
  
  return { sss, pagibig, philhealth, total };
}

export const API = process.env.NEXT_PUBLIC_API_BASE_URL || '';