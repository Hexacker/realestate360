import projects from './data/projects.data';
import ProjectsService from '../features/projects/projects.service';
import { ProjectDTO } from '../features/projects';

const seedProjects = async (): Promise<void> => {
  try {
    const projectsData: ProjectDTO[] = await projects();
    // eslint-disable-next-line no-restricted-syntax
    for (const user of projectsData) {
      // eslint-disable-next-line no-await-in-loop
      await ProjectsService.createProject(user);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error projects seeds ${error}`);
  }
};

export default seedProjects;
