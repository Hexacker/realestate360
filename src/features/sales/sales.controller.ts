import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import SalesService from './sales.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { SaleDTO } from '.';

import { IUser } from '../users';
import { CompaniesService } from '../companies';
import { ClientsService } from '../clients';

class SalesController implements Controller {
  path = '/sales';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getCompanySales);
    this.route.get('/:id', this.getSale);
    this.route.get('/client/:id', this.getClientSales);
    this.route.post('/', [validationMiddleware(SaleDTO)], this.createSale);
    this.route.put('/:id', [validationMiddleware(SaleDTO)], this.updateSale);
    this.route.delete('/:id', this.deleteSale);
  }

  async getSale(req: Request, res: Response): Promise<void> {
    const sale = await SalesService.getSale(req.params.id);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      sale.client.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(sale);
  }

  async getClientSales(req: Request, res: Response): Promise<void> {
    const { id: clientId } = req.params;
    const client = await ClientsService.getClient(clientId);
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const clientSales = await SalesService.getClientSales(client);

    res
      .status(HttpStatusEnum.SUCCESS)
      .send({ list: clientSales, count: clientSales.length });
  }

  async getCompanySales(req: Request, res: Response): Promise<void> {
    const { id: companyId } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const company = await CompaniesService.getCompany(companyId);

    const companySales = await SalesService.getCompanySales(company);

    res
      .status(HttpStatusEnum.SUCCESS)
      .send({ list: companySales, count: companySales.length });
  }

  async getAllSales(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const sales = await SalesService.listAllSales(connectedUser, limit, skip);
    res.status(HttpStatusEnum.SUCCESS).send(sales);
  }

  async createSale(req: Request, res: Response): Promise<void> {
    const saleDto: SaleDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const client = await ClientsService.getClient(saleDto.clientId);

    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const sale = await SalesService.createSale(saleDto, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(sale);
  }

  async updateSale(req: Request, res: Response): Promise<void> {
    const saleDto: SaleDTO = req.body;
    const { id } = req.params;

    const connectedUser: IUser = (req as any).iUser;

    const client = await ClientsService.getClient(saleDto.clientId);

    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const sale = await SalesService.getSale(id);
    await CompaniesService.hasPermissionOn(
      sale.client.company._id,
      connectedUser._id,
    );

    const updatedSale = await SalesService.updateSale(
      id,
      saleDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedSale);
  }

  async deleteSale(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const sale = await SalesService.getSale(req.params.id);
    await CompaniesService.hasPermissionOn(
      sale.client.company._id,
      connectedUser._id,
    );

    const deleted = await SalesService.deleteSale(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default SalesController;
