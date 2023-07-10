import PaymentPlan from './paymentPlan.model';
import IPaymentPlan from './paymentPlan.interface';
import PaymentPlanDTO from './dto/paymentPlan.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { SalesService } from '../sales';
import { QuotesService } from '../quotes';
import { IUser } from '../users';
import { CompaniesService, ICompany } from '../companies';

export default class PaymentPlansService {
  /**
   * find payment plan by id
   * @static
   * @since 1.0.0
   * @param {uuid} id payment plan id must be a valid uuid
   * @return {Promise<IPaymentPlan | null>} a promise of IPaymentPlan or null
   * @throws 404 error, payment plan not found message
   */
  static getPaymentPlan = async (id: string): Promise<IPaymentPlan> => {
    try {
      const pmplan = await PaymentPlan.findById(id)
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!pmplan) throw 'Error';

      return pmplan;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment plan not found'),
      );
    }
  };

  static getCompanyPaymentPlans = async (
    company: ICompany,
  ): Promise<IPaymentPlan[]> => {
    try {
      const pmplans = await PaymentPlan.find({ company })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!pmplans) throw 'Error';

      return pmplans;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment plan not found'),
      );
    }
  };

  /**
   * get all payment plans with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IPaymentPlan[]; count: number }>} a promise of { list: IPaymentPlan[]; count: number }
   * @throws 404 error, payment plans not found
   */
  static listAllPaymentPlans = async (
    connectedUser: IUser,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IPaymentPlan[];
    count: number;
  }> => {
    const { list } = await CompaniesService.getUserCompanies(connectedUser._id);

    const usercompany: ICompany | null = list.length > 0 ? list[0] : null;

    if (!usercompany) throw 'Error';

    const count: number = await PaymentPlan.countDocuments();
    let paymentPlans: IPaymentPlan[] = [];
    try {
      const query = PaymentPlan.find({ company: usercompany })
        .populate({
          path: 'company',
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
        paymentPlans = await query.limit(limit).skip(skip);
      } else {
        paymentPlans = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment plans not found'),
      );
    }

    const result = {
      list: paymentPlans,
      count,
    };
    return result;
  };

  /**
   * create a new payment plan
   * @static
   * @since 1.0.0
   * @param {PaymentPlanDTO} paymentPlanDTO the payment plan DTO object
   * @return {Promise<IPaymentPlan>}  a promise of IPaymentPlan
   * @throws 400 error, Can't create the new company
   */
  static createPaymentPlan = async (
    paymentPlanDto: PaymentPlanDTO,
    connectedUser?: IUser,
  ): Promise<IPaymentPlan> => {
    try {
      const company = await CompaniesService.getCompany(
        paymentPlanDto.companyId,
      );

      if (!company)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Company ID'),
        );

      const paymentPlan: IPaymentPlan = new PaymentPlan();
      paymentPlan.amount = paymentPlanDto.amount;
      paymentPlan.downPayment = paymentPlanDto.downPayment;
      paymentPlan.finalPayment = paymentPlanDto.finalPayment;
      paymentPlan.frequency = paymentPlanDto.frequency;
      paymentPlan.interestRate = paymentPlanDto.interestRate;
      paymentPlan.isActivated = paymentPlanDto.isActivated;
      paymentPlan.createdBy = connectedUser;
      paymentPlan.company = company;
      return PaymentPlan.create(paymentPlan);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new payment plan",
        ),
      );
    }
  };

  /**
   * update payment plan
   * @static
   * @since 1.0.0
   * @param {uuid} id payment plan id must be a valid uuid
   * @param {PaymentPlanDTO} paymentPlanDTO payment plan dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, payment plan not found message
   */
  static updatePaymentPlan = async (
    id: string,
    paymentPlanDto: PaymentPlanDTO,
    connectedUser?: IUser,
  ): Promise<IPaymentPlan> => {
    try {
      const paymentPlan: IPaymentPlan | null = await PaymentPlan.findById(id);

      const company = await CompaniesService.getCompany(
        paymentPlanDto.companyId,
      );

      if (!company)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Company ID'),
        );

      if (paymentPlan) {
        paymentPlan.amount = paymentPlanDto.amount;
        paymentPlan.downPayment = paymentPlanDto.downPayment;
        paymentPlan.finalPayment = paymentPlanDto.finalPayment;
        paymentPlan.frequency = paymentPlanDto.frequency;
        paymentPlan.interestRate = paymentPlanDto.interestRate;
        paymentPlan.isActivated = paymentPlanDto.isActivated;
        paymentPlan.lastUpdatedBy = connectedUser;
        paymentPlan.company = company;

        let updated: any;

        updated = await PaymentPlan.findByIdAndUpdate({ _id: id }, paymentPlan);

        if (!updated) throw 'Error';

        updated = await PaymentPlansService.getPaymentPlan(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'payment plan not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new payment plan",
        ),
      );
    }
  };

  /**
   * delete paymentPlan
   * @static
   * @since 1.0.0
   * @param {uuid} id paymentPlan id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, paymentPlan not found message
   * @throws 403 error, can't remove this payment plan that's used with other entities
   * @TODO add relationships condition on delete (quotes, sales)
   */
  static deletePaymentPlan = async (
    id: string,
  ): Promise<DeleteFromDatabase> => {
    try {
      const paymentPlan: IPaymentPlan | null = await PaymentPlan.findById(id);
      if (paymentPlan) {
        const salesCount: number = await SalesService.getSalesCountByPaymentPlan(
          id,
        );
        const quotessCount: number = await QuotesService.getQuotesCountByPaymentPlan(
          id,
        );
        if (salesCount + quotessCount !== 0) {
          throw new Error(
            `can't remove this company that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'payment plan not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return PaymentPlan.deleteOne({ _id: id });
  };
}
