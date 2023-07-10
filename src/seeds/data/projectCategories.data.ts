import * as faker from 'faker';
import { Company } from '../../features/companies';
import { ProjectCategoryDTO } from '../../features/projectCategories';

const projectCategories = async (): Promise<ProjectCategoryDTO[]> => {
  const projectCategoriesData: ProjectCategoryDTO[] = [];
  const companies = await Company.find({});
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const projectCategory: ProjectCategoryDTO = new ProjectCategoryDTO();
    // projectCategory.roles = roles.filter((role, index) => index > i % (roles.length));
    projectCategory.isActivated = true;
    projectCategory.name = faker.random.word();
    projectCategory.companyId = companies[i % companies.length]._id;
    projectCategoriesData.push(projectCategory);
  }
  return projectCategoriesData;
};
export default projectCategories;
