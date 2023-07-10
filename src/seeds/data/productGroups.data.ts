import * as faker from 'faker';
import { ProductGroupDTO } from '../../features/productGroups';
import { IProject, Project } from '../../features/projects';

const productGroups = async (): Promise<ProductGroupDTO[]> => {
  const productGroupsData: ProductGroupDTO[] = [];
  const projects: IProject[] = await Project.find();
  const projectIds = projects.map(project => project._id);
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const productGroup: ProductGroupDTO = new ProductGroupDTO();
    // user.roles = roles.filter((role, index) => index > i % (roles.length));
    productGroup.isActivated = true;
    productGroup.name = faker.random.word();
    productGroup.quantity = faker.random.number(500);
    productGroup.projectId = projectIds[i % (projectIds.length - 1)];
    productGroupsData.push(productGroup);
  }
  return productGroupsData;
};
export default productGroups;
