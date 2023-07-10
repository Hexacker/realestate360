import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import CompaniesService from './companies.service';
import CompanyDTO from './dto/company.dto';

import { IUser } from '../users';

class CompaniesController implements Controller {
  path = '/companies';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/', this.getUserCompanies);
    this.route.get('/:id', this.getCompany);
    this.route.put(
      '/:id',
      [validationMiddleware(CompanyDTO)],
      this.updateCompany,
    );
    this.route.delete('/:id', this.deleteCompany);
    this.route.get('/admins/:id', this.getCompanyAdmins);
    this.route.get('/user/:id', this.getUserCompanies);
  }

  async getCompany(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const company = await CompaniesService.getCompany(req.params.id);

    await CompaniesService.hasPermissionOn(company._id, connectedUser._id);

    res.status(HttpStatusEnum.SUCCESS).send(company);
  }

  async getCompanyAdmins(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const companyId = req.params.id;

    const admins = await CompaniesService.listAllCompanyAdmins(
      companyId,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(admins);
  }

  async getUserCompanies(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const company = await CompaniesService.getUserCompanies(
      connectedUser || req.params.id,
      limit,
      skip,
    );
    
    res.status(HttpStatusEnum.SUCCESS).send(company);
  }

  async getAllCompanies(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const companies = await CompaniesService.listAllCompanies(limit, skip);
    res.status(HttpStatusEnum.SUCCESS).send(companies);
  }

  async createCompany(req: Request, res: Response): Promise<void> {
    const companyDto: CompanyDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const company = await CompaniesService.createCompany(
      companyDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(company);
  }

  async updateCompany(req: Request, res: Response): Promise<void> {
    const companyDto: CompanyDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(id, connectedUser._id);

    const updatedCompany = await CompaniesService.updateCompany(
      id,
      companyDto,
      connectedUser,
    );

    res.status(HttpStatusEnum.SUCCESS).send(updatedCompany);
  }

  async deleteCompany(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(req.params.id, connectedUser._id);

    const company = await CompaniesService.deleteCompany(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(company);
  }
}

export default CompaniesController;
