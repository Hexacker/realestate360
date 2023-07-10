import products from './data/products.data';
import ProductsService from '../features/products/products.service';
import { ProductDTO } from '../features/products';

const seedProducts = async (): Promise<void> => {
  try {
    const productsData: ProductDTO[] = await products();
    // eslint-disable-next-line no-restricted-syntax
    for (const product of productsData) {
      // eslint-disable-next-line no-await-in-loop
      await ProductsService.createProduct(product);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error products seeds ${error}`);
  }
};

export default seedProducts;
