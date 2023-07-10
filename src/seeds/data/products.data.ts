/* eslint-disable no-unused-expressions */
import * as faker from 'faker';
import { ProductDTO } from '../../features/products';
import { ProductStatus } from '../../features/products/enum/status.enum';
import { IProductGroup, ProductGroup } from '../../features/productGroups';
import Perimeter from '../../helpers/perimeter.class';

const products = async (): Promise<ProductDTO[]> => {
  const productsData: ProductDTO[] = [];
  const groups: IProductGroup[] = await ProductGroup.find();
  const groupIds: string[] = groups.map(group => group._id);
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const product: ProductDTO = new ProductDTO();
    // product.roles = roles.filter((role, index) => index > i % (roles.length));
    product.isActivated = true;
    product.price = faker.random.number(10000);
    product.areaTotal = faker.random.number(5000);
    product.salePrice =
      product.price - ((product.price * faker.random.number(5)) % 100);
    product.attachment = faker.image.avatar();

    product.groupId = groupIds[i % groupIds.length];
    const perimeter: Perimeter = new Perimeter();
    perimeter.north = faker.random.float({
      min: 0,
      max: 100,
      precision: 0.01,
    });
    perimeter.south = faker.random.float({
      min: 0,
      max: 100,
      precision: 0.01,
    });
    perimeter.east = faker.random.float({
      min: 0,
      max: 100,
      precision: 0.01,
    });
    perimeter.west = faker.random.float({
      min: 0,
      max: 100,
      precision: 0.01,
    });
    product.perimeter = perimeter;
    if (i <= 3) {
      product.status = ProductStatus.RUNNING_LOW;
    } else if (i > 3 && i < 7) {
      product.status = ProductStatus.IN_STOCK;
    } else {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
    productsData.push(product);
  }
  return productsData;
};
export default products;
