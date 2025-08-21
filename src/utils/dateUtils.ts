// Date utility functions for handling various date formats

export const parseExcelDate = (excelDate: number | string): Date => {
  if (typeof excelDate === 'string') {
    // Try to parse as regular date string first
    const parsed = new Date(excelDate);
    if (!isNaN(parsed.getTime())) {
      return parsed;
    }
    
    // If that fails, try to parse as Excel serial number
    const serialNumber = parseFloat(excelDate);
    if (!isNaN(serialNumber)) {
      return excelSerialToDate(serialNumber);
    }
    
    // Fallback to current date
    return new Date();
  }
  
  return excelSerialToDate(excelDate);
};

export const excelSerialToDate = (serial: number): Date => {
  // Excel date serial number starts from January 1, 1900
  // But Excel incorrectly treats 1900 as a leap year
  const excelEpoch = new Date(1899, 11, 30); // December 30, 1899
  const msPerDay = 24 * 60 * 60 * 1000;
  
  return new Date(excelEpoch.getTime() + serial * msPerDay);
};

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isValidDate = (date: any): boolean => {
  return date instanceof Date && !isNaN(date.getTime());
};