import { IProduct, Product } from '../features/products';
import {
  IProject,
  Project,
  ProjectsService,
  ProjectDTO,
} from '../features/projects';

const seedUpdates = async (): Promise<void> => {
  try {
    const products: IProduct[] = await Product.find();
    const projects: IProject[] = await Project.find();
    // eslint-disable-next-line no-restricted-syntax
    for (const [index, project] of projects.entries()) {
      const projectDTO: ProjectDTO = new ProjectDTO();
      projectDTO.address = project.address;
      projectDTO.areaTotal = project.areaTotal;
      projectDTO.city = project.city;
      projectDTO.name = project.name;
      projectDTO.state = project.state;
      projectDTO.currency = project.currency;

      projectDTO.companyId = (project.company as any) as string;
      projectDTO.countryId = (project.country as any) as string;
      projectDTO.categories = (project.categories as any) as string[];
      projectDTO.products = [
        products[index % products.length]._id,
        products[(index + 1) % products.length]._id,
      ];
      // eslint-disable-next-line no-await-in-loop
      await ProjectsService.updateProject(project._id, projectDTO);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error updates seeds ${error}`);
  }
};

export default seedUpdates;
