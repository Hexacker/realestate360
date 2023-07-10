import productGroups from './data/productGroups.data';
import ProductGroupsService from '../features/productGroups/productGroups.service';
import { ProductGroupDTO } from '../features/productGroups';

const seedProductGroups = async (): Promise<void> => {
  try {
    const productGroupsData: ProductGroupDTO[] = await productGroups();
    // eslint-disable-next-line no-restricted-syntax
    for (const user of productGroupsData) {
      // eslint-disable-next-line no-await-in-loop
      await ProductGroupsService.createGroupProduct(user);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error product Groups seeds ${error}`);
  }
};

export default seedProductGroups;
