/* eslint-disable no-shadow */
/* eslint-disable no-plusplus */
import * as faker from 'faker';
import { ProjectDTO } from '../../features/projects';
import {
  IProjectCategory,
  ProjectCategory,
} from '../../features/projectCategories';
import { ICompany, Company } from '../../features/companies';
import { ICountry, Country } from '../../features/countries';

const projects = async (): Promise<ProjectDTO[]> => {
  const projectsData: ProjectDTO[] = [];
  const projectCategories: IProjectCategory[] = await ProjectCategory.find();
  const categoryIds = projectCategories.map(category => category._id);
  const companies: ICompany[] = await Company.find();
  const countries: ICountry[] = await Country.find();
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const project: ProjectDTO = new ProjectDTO();
    // user.roles = roles.filter((role, index) => index > i % (roles.length));
    project.isActivated = true;
    project.name = faker.name.firstName();
    project.address = faker.address.streetAddress();
    project.city = faker.address.city();
    project.state = faker.address.state();
    project.companyId = companies[i % companies.length]._id;
    project.countryId = countries[i % countries.length]._id;
    project.areaTotal = faker.random.number(1000);
    project.categories = [];
    for (let i = 0; i <= faker.random.number(categoryIds.length); i++) {
      project.categories.push(categoryIds[i]);
    }
    project.currency = 'USD';
    // eslint-disable-next-line no-multi-assign
    projectsData.push(project);
  }
  return projectsData;
};
export default projects;
