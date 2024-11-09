import { Artist, Sale, Setting } from '../../types';

interface ValidationResult<T> {
  isValid: boolean;
  error?: string;
  data?: T;
}

export function validateArtist(artist: any): ValidationResult<Artist> {
  try {
    if (!artist.artistcode) {
      return { isValid: false, error: 'Artist Code is required' };
    }
    if (!artist.firstname || !artist.lastname) {
      return { isValid: false, error: 'First name and last name are required' };
    }
    if (!artist.commissionrate || isNaN(Number(artist.commissionrate))) {
      return { isValid: false, error: 'Commission rate must be a valid number' };
    }
    
    const commissionRate = Number(artist.commissionrate);
    if (commissionRate < 0 || commissionRate > 1) {
      return { isValid: false, error: 'Commission rate must be between 0 and 1' };
    }

    if (!artist.classification || !['Member', 'Gift Shop', 'Community Gallery', 'Guest Gallery', 'Former Member', 'Self'].includes(artist.classification)) {
      return { isValid: false, error: 'Invalid classification' };
    }

    return {
      isValid: true,
      data: {
        artistCode: artist.artistcode,
        fullName: `${artist.firstname} ${artist.lastname}`,
        firstName: artist.firstname,
        lastName: artist.lastname,
        commissionRate: commissionRate,
        email: artist.email || null,
        classification: artist.classification
      }
    };
  } catch (error) {
    return { isValid: false, error: 'Invalid artist data' };
  }
}

export function validateSale(sale: any): ValidationResult<Sale> {
  try {
    if (!sale.date) {
      return { isValid: false, error: 'Date is required' };
    }
    if (!sale.artistcode) {
      return { isValid: false, error: 'Artist Code is required' };
    }
    if (!sale.qty && sale.qty !== 0) {
      return { isValid: false, error: 'Quantity is required' };
    }
    if (!sale.grosssales && sale.grosssales !== 0) {
      return { isValid: false, error: 'Gross Sales is required' };
    }

    const qty = Number(sale.qty);
    if (isNaN(qty)) {
      return { isValid: false, error: 'Quantity must be a number' };
    }

    const grossSales = Number(sale.grosssales);
    if (isNaN(grossSales)) {
      return { isValid: false, error: 'Gross Sales must be a number' };
    }

    let dateStr = sale.date;
    let parsedDate: Date | null = null;

    const formats = [
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/
    ];

    for (const format of formats) {
      const match = dateStr.match(format);
      if (match) {
        if (format === formats[0]) {
          const [_, year, month, day] = match;
          parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        } else {
          const [_, month, day, year] = match;
          parsedDate = new Date(Number(year), Number(month) - 1, Number(day));
        }
        break;
      }
    }

    if (!parsedDate || isNaN(parsedDate.getTime())) {
      return { isValid: false, error: 'Invalid date format. Expected YYYY-MM-DD or MM/DD/YYYY' };
    }

    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    return {
      isValid: true,
      data: {
        date: formattedDate,
        artistCode: sale.artistcode,
        qty: qty,
        pricePointName: sale.pricepointname || null,
        sku: sale.sku || null,
        grossSales: grossSales,
        notes: sale.notes
      }
    };
  } catch (error) {
    return { isValid: false, error: 'Invalid sale data' };
  }
}

export function validateSetting(setting: any): ValidationResult<Setting> {
  try {
    if (!setting.parametername) {
      return { isValid: false, error: 'Parameter name is required' };
    }
    if (!setting.parametervalue) {
      return { isValid: false, error: 'Parameter value is required' };
    }

    return {
      isValid: true,
      data: {
        parameterName: setting.parametername,
        parameterValue: setting.parametervalue,
        notes: setting.notes
      }
    };
  } catch (error) {
    return { isValid: false, error: 'Invalid setting data' };
  }
}