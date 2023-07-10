import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { IProject, Project } from '../../projects';
import ProductGroupDTO from '../dto/productGroup.dto';

@ValidatorConstraint({ async: true })
export class IsProjectValid {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(id: string) {
    const project: IProject | null = await Project.findById(id);
    return !!(project && project.isActivated);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  defaultMessage(args: ValidationArguments) {
    return `Project with id: "${(args.object as ProductGroupDTO).projectId}" dons not exists or not active!`;
  }
}
