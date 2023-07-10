import projectCategories from './data/projectCategories.data';
import ProjectCategoriessService from '../features/projectCategories/projectCategories.service';
import { ProjectCategoryDTO } from '../features/projectCategories';

const seedProjectCategoriess = async (): Promise<void> => {
  try {
    const projectCategoriesData: ProjectCategoryDTO[] = await projectCategories();
    // eslint-disable-next-line no-restricted-syntax
    for (const projectCategory of projectCategoriesData) {
      // eslint-disable-next-line no-await-in-loop
      await ProjectCategoriessService.createProjectCategory(projectCategory);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error projectCategorys seeds ${error}`);
  }
};

export default seedProjectCategoriess;
