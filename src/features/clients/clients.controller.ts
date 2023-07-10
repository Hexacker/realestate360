import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import ClientsService from './clients.service';
import ClientDTO from './dto/client.dto';

import { IUser } from '../users';
import { CompaniesService } from '../companies';

class ClientsController implements Controller {
  path = '/clients';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllClientsByCompany);
    this.route.get('/:id', this.getClient);
    this.route.post('/', validationMiddleware(ClientDTO), this.createClient);
    this.route.put(
      '/:id',
      [validationMiddleware(ClientDTO)],
      this.updateClient,
    );
    this.route.delete('/:id', this.deleteClient);
    this.route.get('/counts/:id', this.getClientsCountByCompany);
  }

  async getClient(req: Request, res: Response): Promise<void> {
    const client = await ClientsService.getClient(req.params.id);
    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(client);
  }

  async getAllClients(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const clients = await ClientsService.listAllClients(
      connectedUser,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(clients);
  }

  async getAllClientsByCompany(req: Request, res: Response): Promise<void> {
    const { id: companyId } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const clients = await ClientsService.listAllClientsByCompany(
      companyId,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(clients);
  }

  async getClientsCountByCompany(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(id, connectedUser._id);

    const nbClients = await ClientsService.getClientsCountByCompany(id);
    res.status(HttpStatusEnum.SUCCESS).send(nbClients);
  }

  async createClient(req: Request, res: Response): Promise<void> {
    const clientDTO: ClientDTO = req.body;

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      clientDTO.companyId,
      connectedUser._id,
    );

    const client = await ClientsService.createClient(clientDTO, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(client);
  }

  async updateClient(req: Request, res: Response): Promise<void> {
    const clientDTO: ClientDTO = req.body;
    const { id } = req.params;

    const client = await ClientsService.getClient(id);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    await CompaniesService.hasPermissionOn(
      clientDTO.companyId,
      connectedUser._id,
    );

    const updatedClient = await ClientsService.updateClient(
      id,
      clientDTO,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedClient);
  }

  async deleteClient(req: Request, res: Response): Promise<void> {
    const client = await ClientsService.getClient(req.params.id);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const deleted = await ClientsService.deleteClient(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default ClientsController;
