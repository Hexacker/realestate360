/* eslint-disable no-unused-expressions */
import BankAccount from './bankAccount.model';
import IBankAccount from './bankAccount.interface';
import { BankAccountDTO } from '.';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { Company, ICompany } from '../companies';
import { IPayment, PaymentsService } from '../payments';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { IUser } from '../users';
import { IClient } from '../clients';

export default class BankAccountsService {
  /**
   * find bank account by id
   * @static
   * @since 1.0.0
   * @param {uuid} id bank account id must be a valid uuid
   * @return {Promise<IBankAccount | null>} a promise of IBankAccount or null
   * @throws 404 error, bank account not found message
   */
  static getBankAccount = async (id: string): Promise<IBankAccount> => {
    try {
      const bankAccount = await BankAccount.findById(id)
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!bankAccount) throw 'Error';

      return bankAccount;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'bank account not found'),
      );
    }
  };

  static getClientsBankAccount = async (
    client: IClient,
  ): Promise<IBankAccount[]> => {
    try {
      const clientsPayments = await PaymentsService.getClientPayments(client);

      const clientsPaymentsIds = clientsPayments.map((cp: IPayment) => cp._id);

      const bankAccounts = await BankAccount.find({
        _id: { $in: clientsPaymentsIds },
      })
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      return bankAccounts;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'bank account not found'),
      );
    }
  };

  /**
   * get all bank accounts with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IBankAccount[]; count: number }>} a promise of { list: IBankAccount[]; count: number }
   * @throws 404 error
   */
  static listAllBankAccounts = async (
    connectedUser: IUser,
    company: ICompany,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IBankAccount[];
    count: number;
  }> => {
    const count: number = await BankAccount.countDocuments({
      company,
    });
    let accounts: IBankAccount[] = [];
    try {
      const query = BankAccount.find({ company })
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });
      if (limit !== undefined && skip !== undefined) {
        accounts = await query.limit(limit).skip(skip);
      } else {
        accounts = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error: cant get bank accounts',
        ),
      );
    }

    const result = {
      list: accounts,
      count,
    };
    return result;
  };

  /**
   * create a new bank account
   * @static
   * @since 1.0.0
   * @param {BankAccountDTO} bankAccountDTO the bank account DTO object
   * @return {Promise<IBankAccount>}  a promise of IBankAccount
   * @throws 400 error, Can't create the new bank account
   */
  static createBankAccount = async (
    bankAccountDTO: BankAccountDTO,
    connectedUser?: IUser,
  ): Promise<IBankAccount> => {
    try {
      const bankAccount: IBankAccount = new BankAccount();
      bankAccount.name = bankAccountDTO.name;
      bankAccount.bankName = bankAccountDTO.bankName;
      bankAccount.typeAccount = bankAccountDTO.typeAccount;
      bankAccount.isActivated = bankAccountDTO.isActivated;
      bankAccount.createdBy = connectedUser;
      const company: ICompany = new Company();
      company._id = bankAccountDTO.companyId;
      bankAccount.company = company;
      return BankAccount.create(bankAccount);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new bank account",
        ),
      );
    }
  };

  /**
   * update bank account
   * @static
   * @since 1.0.0
   * @param {uuid} id bank account id must be a valid uuid
   * @param {BankAccountDTO} bankAccountDTO dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, bank account not found message
   */
  static updateBankAccount = async (
    id: string,
    bankAccountDTO: BankAccountDTO,
    connectedUser?: IUser,
  ): Promise<IBankAccount> => {
    try {
      const bankAccount = await BankAccount.findById(id);
      if (bankAccount) {
        bankAccount.name = bankAccountDTO.name;
        bankAccount.bankName = bankAccountDTO.bankName;
        bankAccount.typeAccount = bankAccountDTO.typeAccount;
        bankAccount.isActivated = bankAccountDTO.isActivated;
        bankAccount.lastUpdatedBy = connectedUser;
        const company: ICompany = new Company();
        // eslint-disable-next-line no-underscore-dangle
        company._id = bankAccountDTO.companyId;
        bankAccount.company = company;

        let updated: any;

        updated = await BankAccount.findByIdAndUpdate({ _id: id }, bankAccount);

        if (!updated) throw 'Error';

        updated = await BankAccountsService.getBankAccount(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Bank account not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new bank account",
        ),
      );
    }
  };

  /**
   * delete bank account
   * @static
   * @since 1.0.0
   * @param {uuid} id bank account id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, bank account not found message
   * @throws 403 error, payments with bank account found message
   */
  static deleteBankAccount = async (
    id: string,
  ): Promise<DeleteFromDatabase> => {
    try {
      try {
        const bankAccount: IBankAccount | null = await BankAccount.findById(id);
        if (bankAccount) {
          const paymentsCount: number = await PaymentsService.getPaymentsCountByBankAccount(
            id,
          );

          if (paymentsCount !== 0) {
            throw new Error(
              `can't remove this bank account that's used with ${paymentsCount} payement${
                paymentsCount > 1 ? 's' : ''
              }`,
            );
          }
        } else {
          return Promise.reject(
            new HttpException(
              HttpStatusEnum.NOT_FOUND,
              'bank account not exist',
            ),
          );
        }
      } catch (error) {
        return Promise.reject(
          new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
        );
      }
      return BankAccount.deleteOne({ _id: id });
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Server Error: can't delete bank account",
        ),
      );
    }
  };

  /**
   * get bank accounts count by company id
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<number>} a promise of count
   */
  static getBankAccountsCountByCompany = async (
    companyId: string,
  ): Promise<number> => {
    const company: ICompany = new Company();
    company._id = companyId;
    return BankAccount.countDocuments({ company });
  };
}
