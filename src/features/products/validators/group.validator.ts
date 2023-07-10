import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { IProductGroup, ProductGroup } from '../../productGroups';
import { ProductDTO } from "..";

@ValidatorConstraint({ async: true })
export class IsGroupIdValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(id: string) {
    const group: IProductGroup | null = await ProductGroup.findById(id);
    return !!(group && group.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `Product Group with id: "${(args.object as ProductDTO).groupId}" dons not exists or not active!`;
  }
}
