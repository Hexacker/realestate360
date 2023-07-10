import { Request, Response, Router } from 'express';
import { IPaymentPlan, PaymentPlanDTO } from '.';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import PaymentPlansService from './paymentPlans.service';

import { IUser } from '../users';
import { CompaniesService } from '../companies';
import { ClientsService } from '../clients';
import { SalesService } from '../sales';

class PaymentPlansController implements Controller {
  path = '/payment-plans';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getCompanyPaymentPlans);
    this.route.get('/:id', this.getPaymentPlan);
    this.route.get('/client/:id', this.getClientPaymentPlans);
    this.route.post(
      '/',
      [validationMiddleware(PaymentPlanDTO)],
      this.createPaymentPlan,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(PaymentPlanDTO)],
      this.updatePaymentPlan,
    );
    this.route.delete('/:id', this.deletePaymentPlan);
  }

  async getPaymentPlan(req: Request, res: Response): Promise<void> {
    const paymentPlan = await PaymentPlansService.getPaymentPlan(req.params.id);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      paymentPlan.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(paymentPlan);
  }

  async getCompanyPaymentPlans(req: Request, res: Response): Promise<void> {
    const { id: companyId } = req.params;

    const company = await CompaniesService.getCompany(companyId);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(company._id, connectedUser._id);

    const companyPaymentPlans = await PaymentPlansService.getCompanyPaymentPlans(
      company,
    );

    res.status(HttpStatusEnum.SUCCESS).send({
      list: companyPaymentPlans,
      count: companyPaymentPlans.length,
    });
  }

  async getClientPaymentPlans(req: Request, res: Response): Promise<void> {
    const { id: clientId } = req.params;

    const client = await ClientsService.getClient(clientId);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );

    const clientSales = await SalesService.getClientSales(client);

    const clientPMPs: IPaymentPlan[] = clientSales.map(
      clientSale => clientSale.paymentPlan,
    );

    res.status(HttpStatusEnum.SUCCESS).send({
      list: clientPMPs,
      count: clientPMPs.length,
    });
  }

  async getAllPaymentPlans(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const paymentPlans = await PaymentPlansService.listAllPaymentPlans(
      connectedUser,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(paymentPlans);
  }

  async createPaymentPlan(req: Request, res: Response): Promise<void> {
    const paymentPlanDto: PaymentPlanDTO = req.body;

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      paymentPlanDto.companyId,
      connectedUser._id,
    );

    const paymentPlan = await PaymentPlansService.createPaymentPlan(
      paymentPlanDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(paymentPlan);
  }

  async updatePaymentPlan(req: Request, res: Response): Promise<void> {
    const paymentPlanDto: PaymentPlanDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const paymentPlan = await PaymentPlansService.getPaymentPlan(id);

    await CompaniesService.hasPermissionOn(
      paymentPlan.company._id,
      connectedUser._id,
    );

    await CompaniesService.hasPermissionOn(
      paymentPlanDto.companyId,
      connectedUser._id,
    );

    const updatedPaymentPlan = await PaymentPlansService.updatePaymentPlan(
      id,
      paymentPlanDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedPaymentPlan);
  }

  async deletePaymentPlan(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const paymentPlan = await PaymentPlansService.getPaymentPlan(id);

    const connectedUser: IUser = (req as any).iUser;
    await CompaniesService.hasPermissionOn(
      paymentPlan.company._id,
      connectedUser._id,
    );

    await PaymentPlansService.deletePaymentPlan(id);
    res.status(HttpStatusEnum.SUCCESS).send(paymentPlan);
  }
}

export default PaymentPlansController;
