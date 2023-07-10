import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import BankAccountsService from './bankAccounts.service';
import BankAccountDTO from './dto/bankAccount.dto';

import { IUser } from '../users';
import { CompaniesService } from '../companies';
import { ClientsService } from '../clients';

class BankAccountsController implements Controller {
  path = '/bank-accounts';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllBankAccounts);
    this.route.get('/:id', this.getBankAccount);
    this.route.get('/client/:id', this.getClientBankAccounts);
    this.route.post(
      '/',
      [validationMiddleware(BankAccountDTO)],
      this.createBankAccount,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(BankAccountDTO)],
      this.updateBankAccount,
    );
    this.route.delete('/:id', this.deleteBankAccount);
  }

  async getBankAccount(req: Request, res: Response): Promise<void> {
    const bankAccount = await BankAccountsService.getBankAccount(req.params.id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      bankAccount.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(bankAccount);
  }

  async getClientBankAccounts(req: Request, res: Response): Promise<void> {
    const { id: clientId } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const clinet = await ClientsService.getClient(clientId);

    await CompaniesService.hasPermissionOn(
      clinet.company._id,
      connectedUser._id,
    );

    const clientBankAccounts = await BankAccountsService.getClientsBankAccount(
      clinet,
    );

    res.status(HttpStatusEnum.SUCCESS).send(clientBankAccounts);
  }

  async getAllBankAccounts(req: Request, res: Response): Promise<void> {
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

    const bankAccounts = await BankAccountsService.listAllBankAccounts(
      connectedUser,
      company,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(bankAccounts);
  }

  async createBankAccount(req: Request, res: Response): Promise<void> {
    const bankAccountDto: BankAccountDTO = req.body;

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      bankAccountDto.companyId,
      connectedUser._id,
    );

    const bankAccount = await BankAccountsService.createBankAccount(
      bankAccountDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(bankAccount);
  }

  async updateBankAccount(req: Request, res: Response): Promise<void> {
    const bankAccountDto: BankAccountDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      bankAccountDto.companyId,
      connectedUser._id,
    );

    const bankAccount = await BankAccountsService.getBankAccount(id);

    await CompaniesService.hasPermissionOn(
      bankAccount.company._id,
      connectedUser._id,
    );

    const updatedBankAccount = await BankAccountsService.updateBankAccount(
      id,
      bankAccountDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedBankAccount);
  }

  async deleteBankAccount(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const bankAccount = await BankAccountsService.getBankAccount(req.params.id);

    await CompaniesService.hasPermissionOn(
      bankAccount.company._id,
      connectedUser._id,
    );

    const delet = await BankAccountsService.deleteBankAccount(req.params.id);

    res.status(HttpStatusEnum.SUCCESS).send(delet);
  }
}

export default BankAccountsController;
