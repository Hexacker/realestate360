import sales from './data/sales.data';
import SalesService from '../features/sales/sales.service';
import { SaleDTO } from '../features/sales';

const seedSales = async (): Promise<void> => {
  try {
    const salesData: SaleDTO[] = await sales();
    // eslint-disable-next-line no-restricted-syntax
    for (const sale of salesData) {
      // eslint-disable-next-line no-await-in-loop
      await SalesService.createSale(sale);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error sales seeds ${error}`);
  }
};

export default seedSales;
