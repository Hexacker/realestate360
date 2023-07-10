/* eslint-disable no-restricted-syntax */
import { ValidatorConstraint } from 'class-validator';
import { IProduct, Product } from '../../products';

@ValidatorConstraint({ async: true })
export class IsProductsValid {
  async validate(products: string[]): Promise<boolean> {
    for (const id of products) {
      // eslint-disable-next-line no-await-in-loop
      const product: IProduct | null = await Product.findById({
        _id: id,
      });
      if (!(product && product.isActivated)) return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid products !`;
  }
}
