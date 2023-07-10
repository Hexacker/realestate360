import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import PaymentsService from './payments.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { PaymentDTO } from '.';

import { IUser } from '../users';
import { CompaniesService } from '../companies';
import { ClientsService } from '../clients';

class PaymentsController implements Controller {
  path = '/payments';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllPayments);
    this.route.get('/:id', this.getPayment);
    this.route.get('/client/:id', this.getClientPayment);
    this.route.post(
      '/',
      [validationMiddleware(PaymentDTO)],
      this.createPayment,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(PaymentDTO)],
      this.updatePayment,
    );
    this.route.delete('/:id', this.deletePayment);
  }

  async getPayment(req: Request, res: Response): Promise<void> {
    const payment = await PaymentsService.getPayment(req.params.id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      payment.bankAccount.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(payment);
  }

  async getClientPayment(req: Request, res: Response): Promise<void> {
    const { id: clientId } = req.params;

    const client = await ClientsService.getClient(clientId);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const payments = await PaymentsService.getClientPayments(client);

    res.status(HttpStatusEnum.SUCCESS).send(payments);
  }

  async getAllPayments(req: Request, res: Response): Promise<void> {
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
    const payments = await PaymentsService.listAllPayments(
      company,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(payments);
  }

  async createPayment(req: Request, res: Response): Promise<void> {
    const paymentDto: PaymentDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const payment = await PaymentsService.createPayment(
      paymentDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(payment);
  }

  async updatePayment(req: Request, res: Response): Promise<void> {
    const paymentDto: PaymentDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const payment = await PaymentsService.getPayment(id);

    await CompaniesService.hasPermissionOn(
      payment.bankAccount.company._id,
      connectedUser._id,
    );

    const updatedPayment = await PaymentsService.updatePayment(
      id,
      paymentDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedPayment);
  }

  async deletePayment(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const payment = await PaymentsService.getPayment(id);

    await CompaniesService.hasPermissionOn(
      payment.bankAccount.company._id,
      connectedUser._id,
    );

    const deleted = await PaymentsService.deletePayment(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default PaymentsController;
