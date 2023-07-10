import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import ProjectsService from './projects.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { ProjectDTO } from '.';

import { IUser } from '../users';
import { CompaniesService } from '../companies';

class ProjectsController implements Controller {
  path = '/projects';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getCompanysProjects);
    this.route.get('/:id', this.getProject);
    this.route.post(
      '/',
      [validationMiddleware(ProjectDTO)],
      this.createProject,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(ProjectDTO)],
      this.updateProject,
    );
    this.route.delete('/:id', this.deleteProject);
  }

  async getProject(req: Request, res: Response): Promise<void> {
    const project = await ProjectsService.getProject(req.params.id);

    const companyId = project.company._id;

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    res.status(HttpStatusEnum.SUCCESS).send(project);
  }

  async getCompanysProjects(req: Request, res: Response): Promise<void> {
    const companyId: string = req.params.id;

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;

    const companyProjects = await ProjectsService.getCompanysProjects(
      companyId,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(companyProjects);
  }

  async getUserProjects(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;

    const userProjects = await ProjectsService.getUserCompanyProjects(
      req.params.id,
      connectedUser,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(userProjects);
  }

  async getProjectsCreatedByUser(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const userProjects = await ProjectsService.getProjectsCreatedByUser(
      req.params.id,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(userProjects);
  }

  async getAllProjects(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const projects = await ProjectsService.listAllProjects(limit, skip);
    res.status(HttpStatusEnum.SUCCESS).send(projects);
  }

  async createProject(req: Request, res: Response): Promise<void> {
    const projectDto: ProjectDTO = req.body;

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      projectDto.companyId,
      connectedUser._id,
    );

    const project = await ProjectsService.createProject(
      projectDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(project);
  }

  async updateProject(req: Request, res: Response): Promise<void> {
    const projectDto: ProjectDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const project = await ProjectsService.getProject(id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const updatedProject = await ProjectsService.updateProject(
      id,
      projectDto,
      connectedUser,
    );

    res.status(HttpStatusEnum.SUCCESS).send(updatedProject);
  }

  async deleteProject(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const project = await ProjectsService.getProject(id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    await ProjectsService.deleteProject(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(project);
  }
}

export default ProjectsController;
