import { Request, Response, Router } from 'express';
import { RoleDTO } from '.';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import RolesService from './roles.service';

import { IUser } from '../users';
import { getPermissions } from './resources';
import { CompaniesService } from '../companies';

class RolesController implements Controller {
  path = '/roles';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllRoles);
    this.route.get('/permissions/:tag', this.getPermissions);
    this.route.get('/:id', this.getRole);
    this.route.post('/', [validationMiddleware(RoleDTO)], this.createRole);
    this.route.put('/:id', [validationMiddleware(RoleDTO)], this.updateRole);
    this.route.delete('/:id', this.deleteRole);
  }

  async getRole(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const role = await RolesService.getRole(req.params.id);

    await CompaniesService.hasPermissionOn(role.company._id, connectedUser._id);

    res.status(HttpStatusEnum.SUCCESS).send(role);
  }

  async getPermissions(req: Request, res: Response): Promise<void> {
    const { tag } = req.params;
    const permissions: any = getPermissions(tag);
    res.status(HttpStatusEnum.SUCCESS).send(permissions);
  }

  async getAllRoles(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const { id: companyId } = req.params;
    const company = await CompaniesService.getCompany(companyId);

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;

    const roles = await RolesService.listAllRoles(company, limit, skip);

    res.status(HttpStatusEnum.SUCCESS).send(roles);
  }

  async createRole(req: Request, res: Response): Promise<void> {
    const roleDto: RoleDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      roleDto.companyId,
      connectedUser._id,
    );

    const role = await RolesService.createRole(roleDto, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(role);
  }

  async updateRole(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const roleDto: RoleDTO = req.body;
    const { id } = req.params;

    await CompaniesService.hasPermissionOn(
      roleDto.companyId,
      connectedUser._id,
    );

    const role = await RolesService.getRole(id);

    await CompaniesService.hasPermissionOn(role.company._id, connectedUser._id);

    const updatedRole = await RolesService.updateRole(
      id,
      roleDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedRole);
  }

  async deleteRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const connectedUser: IUser = (req as any).iUser;
    const role = await RolesService.getRole(id);

    await CompaniesService.hasPermissionOn(role.company._id, connectedUser._id);

    const deleted = await RolesService.deleteRole(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default RolesController;
