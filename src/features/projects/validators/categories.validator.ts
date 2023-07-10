/* eslint-disable no-restricted-syntax */
import { ValidatorConstraint } from 'class-validator';
import { IProjectCategory, ProjectCategory } from '../../projectCategories';

@ValidatorConstraint({ async: true })
export class IsCategoriesValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(categoriesIds: string[]) {
    for (const id of categoriesIds) {
      // eslint-disable-next-line no-await-in-loop
      const category: IProjectCategory | null = await ProjectCategory.findById({
        _id: id,
      });
      if (!(category && category.isActivated)) return false;
    }
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage() {
    return `invalid categories or not active ones !`;
  }
}
