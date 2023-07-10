/* eslint-disable no-unused-expressions */
import Payment from './payment.model';
import IPayment from './payment.interface';
import { BankAccount, IBankAccount } from '../bankAccounts';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { PaymentDTO } from '.';
import { User, IUser } from '../users';
import { IClient, Client } from '../clients';
import { Sale, ISale } from '../sales';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { CompaniesService, ICompany } from '../companies';

export default class PaymentsService {
  /**
   * find payment by id
   * @static
   * @since 1.0.0
   * @param {uuid} id payment id must be a valid uuid
   * @return {Promise<IPayment | null>} a promise of IPayment or null
   * @throws 404 error, payment not found message
   */
  static getPayment = async (id: string): Promise<IPayment> => {
    try {
      const payment = await Payment.findById(id)
        .populate({
          path: 'client',
        })
        .populate({
          path: 'sale',
        })
        .populate({
          path: 'bankAccount',
          populate: { path: 'company' },
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!payment) throw 'Error';

      return payment;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment not found'),
      );
    }
  };

  static getClientPayments = async (client: IClient): Promise<IPayment[]> => {
    try {
      const clientPayments = await Payment.find({ client })
        .populate({
          path: 'client',
        })
        .populate({
          path: 'sale',
        })
        .populate({
          path: 'bankAccount',
          populate: { path: 'company' },
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!clientPayments) throw 'Error';

      return clientPayments;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment not found'),
      );
    }
  };

  /**
   * get all payments with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IPayment[]; count: number }>} a promise of { list: IPayment[]; count: number }
   * @throws 404 error
   */
  static listAllPayments = async (
    usercompany: ICompany,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IPayment[];
    count: number;
  }> => {
    let payments: IPayment[] = [];
    try {
      const query = await Payment.find()
        .populate({
          path: 'client',
        })
        .populate({
          path: 'sale',
        })
        .populate({
          path: 'bankAccount',
          populate: { path: 'company' },
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      payments = query.filter(
        pm =>
          pm.bankAccount.company._id.toString() === usercompany._id.toString(),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error getting payments',
        ),
      );
    }

    const result = {
      list: payments,
      count: payments.length,
    };
    return result;
  };

  /**
   * create a new payment
   * @static
   * @since 1.0.0
   * @param {PaymentDTO} paymentDTO the payment DTO object
   * @return {Promise<IPayment>}  a promise of IPayment
   * @throws 400 error, Can't create the new payment
   */
  static createPayment = async (
    paymentDTO: PaymentDTO,
    connectedUser?: IUser,
  ): Promise<IPayment> => {
    try {
      const payment: IPayment = new Payment();
      payment.amount = paymentDTO.amount;
      payment.recurringPaymentDay = paymentDTO.recurringPaymentDay;
      payment.receiptFile = paymentDTO.receiptFile;
      payment.dueDate = paymentDTO.dueDate;
      payment.receiptDate = paymentDTO.receiptDate;
      payment.isActivated = paymentDTO.isActivated;
      'isPaid' in paymentDTO &&
        paymentDTO.isPaid !== undefined &&
        (payment.isPaid = paymentDTO.isPaid);

      // lastUpdatedBy
      const lastUpdatedBy: IUser = new User();
      lastUpdatedBy._id = paymentDTO.lastUpdatedBy;
      payment.lastUpdatedBy = lastUpdatedBy;

      // client
      const client: IClient = new Client();
      client._id = paymentDTO.clientId;
      payment.client = client;

      // sale
      const sale: ISale = new Sale();
      sale._id = paymentDTO.saleId;
      payment.sale = sale;

      // bank account
      const bankAccount: IBankAccount = new BankAccount();
      bankAccount._id = paymentDTO.bankAccountId;
      payment.bankAccount = bankAccount;
      payment.createdBy = connectedUser;
      return Payment.create(payment);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new payment",
        ),
      );
    }
  };

  /**
   * update payment
   * @static
   * @since 1.0.0
   * @param {uuid} id payment id must be a valid uuid
   * @param {PaymentDTO} paymentDTO payment dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, payment not found message
   */
  static updatePayment = async (
    id: string,
    paymentDTO: PaymentDTO,
    connectedUser?: IUser,
  ): Promise<IPayment> => {
    try {
      const payment: IPayment | null = await Payment.findById(id);
      if (payment) {
        payment.amount = paymentDTO.amount;
        payment.recurringPaymentDay = paymentDTO.recurringPaymentDay;
        payment.receiptFile = paymentDTO.receiptFile;
        payment.dueDate = paymentDTO.dueDate;
        payment.receiptDate = paymentDTO.receiptDate;
        payment.isActivated = paymentDTO.isActivated;
        'isPaid' in paymentDTO &&
          paymentDTO.isPaid !== undefined &&
          (payment.isPaid = paymentDTO.isPaid);

        // lastUpdatedBy
        const lastUpdatedBy: IUser = new User();
        lastUpdatedBy._id = paymentDTO.lastUpdatedBy;
        payment.lastUpdatedBy = lastUpdatedBy;

        // client
        const client: IClient = new Client();
        client._id = paymentDTO.clientId;
        payment.client = client;

        // sale
        const sale: ISale = new Sale();
        sale._id = paymentDTO.saleId;
        payment.sale = sale;

        // bank account
        const bankAccount: IBankAccount = new BankAccount();
        bankAccount._id = paymentDTO.bankAccountId;
        payment.bankAccount = bankAccount;

        payment.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Payment.findByIdAndUpdate({ _id: id }, payment);

        if (!updated) throw 'Error';

        updated = await PaymentsService.getPayment(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't update the new payment",
        ),
      );
    }
  };

  /**
   * delete payment
   * @static
   * @since 1.0.0
   * @param {uuid} id payment id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, payment not found message
   * @throws 403 error, can't remove this payment that's used with other entities
   */
  static deletePayment = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const payment: IPayment | null = await Payment.findById(id);
      if (payment) {
        return Payment.deleteOne({ _id: id });
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment not exist'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
  };

  /**
   * get payments count by bankAccount id
   * @static
   * @since 1.0.0
   * @param {uuid} id bank account id must be a valid uuid
   * @return {Promise<number>} a promise of count
   */
  static getPaymentsCountByBankAccount = async (
    bankAccountId: string,
  ): Promise<number> => {
    const bankAccount: IBankAccount = new BankAccount();
    bankAccount._id = bankAccountId;
    return Payment.countDocuments({ bankAccount });
  };
}
