import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import ProjectCategoriesService from './projectCategories.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { ProjectCategoryDTO } from '.';

import { IUser } from '../users';
import { CompaniesService } from '../companies';

class ProjectCategoriesController implements Controller {
  path = '/project-categories';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getCompanyProjectCategory);
    this.route.get('/:id', this.getProjectCategory);
    this.route.post(
      '/',
      [validationMiddleware(ProjectCategoryDTO)],
      this.createProjectCategory,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(ProjectCategoryDTO)],
      this.updateProjectCategory,
    );
    this.route.delete('/:id', this.deleteProjectCategory);
  }

  async getProjectCategory(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const ProjectCategory = await ProjectCategoriesService.getProjectCategory(
      req.params.id,
    );

    await CompaniesService.hasPermissionOn(
      ProjectCategory.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(ProjectCategory);
  }

  async getCompanyProjectCategory(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const { id: companyId } = req.params;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const ProjectCategory = await ProjectCategoriesService.getCompanyProjectCategory(
      req.params.id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(ProjectCategory);
  }

  async createProjectCategory(req: Request, res: Response): Promise<void> {
    const projectCategoryDto: ProjectCategoryDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      projectCategoryDto.companyId,
      connectedUser._id,
    );

    const ProjectCategory = await ProjectCategoriesService.createProjectCategory(
      projectCategoryDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(ProjectCategory);
  }

  async updateProjectCategory(req: Request, res: Response): Promise<void> {
    const ProjectCategoryDto: ProjectCategoryDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const ProjectCategory = await ProjectCategoriesService.getProjectCategory(
      id,
    );

    await CompaniesService.hasPermissionOn(
      ProjectCategory.company._id,
      connectedUser._id,
    );

    await CompaniesService.hasPermissionOn(
      ProjectCategoryDto.companyId,
      connectedUser._id,
    );

    const updatedProjectCategory = await ProjectCategoriesService.updateProjectCategory(
      id,
      ProjectCategoryDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedProjectCategory);
  }

  async deleteProjectCategory(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const ProjectCategory = await ProjectCategoriesService.getProjectCategory(
      req.params.id,
    );

    await CompaniesService.hasPermissionOn(
      ProjectCategory.company._id,
      connectedUser._id,
    );

    const deleted = await ProjectCategoriesService.deleteProjectCategory(
      req.params.id,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default ProjectCategoriesController;
