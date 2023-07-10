import { ValidatorConstraint } from 'class-validator';
import { IProduct, Product } from '../../products';

@ValidatorConstraint({ async: true })
export class IsProductValid {
  async validate(productId: string): Promise<boolean> {
    const product: IProduct | null = await Product.findById(productId);
    return !!(product && product.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid product id !`;
  }
}
