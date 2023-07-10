/* eslint-disable no-underscore-dangle */
import Sale from './sale.model';
import ISale from './sale.interface';
import { IPaymentPlan, PaymentPlan } from '../paymentPlans';
import { IProduct, Product } from '../products';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { SaleDTO } from '.';
import { IUser, User } from '../users';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { IClient, Client } from '../clients';
import { CompaniesService, ICompany } from '../companies';

export default class SalesService {
  /**
   * find sale by id
   * @static
   * @since 1.0.0
   * @param {uuid} id sale id must be a valid uuid
   * @return {Promise<ISale | null>} a promise of ISale or null
   * @throws 404 error, sale not found message
   */
  static getSale = async (id: string): Promise<ISale> => {
    try {
      const sale = await Sale.findById(id)
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        })
        .populate({
          path: 'client',
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

      if (!sale) throw 'Error';

      return sale;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not found'),
      );
    }
  };

  static getClientSales = async (client: IClient): Promise<ISale[]> => {
    try {
      const sales = await Sale.find({ client })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        })
        .populate({
          path: 'client',
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

      if (!sales) throw 'Error';

      return sales;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not found'),
      );
    }
  };

  static getCompanySales = async (company: ICompany): Promise<ISale[]> => {
    try {
      const query = await Sale.find({})
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        })
        .populate({
          path: 'client',
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

      const sales = query.filter(
        sale => sale.client.company._id.toString() === company._id.toString(),
      );
      
      if (!sales) throw 'Error';

      return sales;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not found'),
      );
    }
  };

  static getProductSales = async (product: IProduct): Promise<ISale[]> => {
    try {
      const sales = await Sale.find({ product })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        })
        .populate({
          path: 'client',
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

      if (!sales) throw 'Error';

      return sales;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not found'),
      );
    }
  };

  /**
   * get all sales with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: ISale[]; count: number }>} a promise of { list: ISale[]; count: number }
   * @throws 404 error
   */
  static listAllSales = async (
    connectedUser: IUser,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: ISale[];
    count: number;
  }> => {
    const { list } = await CompaniesService.getUserCompanies(connectedUser._id);

    const usercompany: ICompany | null = list.length > 0 ? list[0] : null;

    if (!usercompany) throw 'Error';

    let sales: ISale[] = [];
    try {
      const query = await Sale.find()
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        })
        .populate({
          path: 'client',
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

      sales = query.filter(
        sale =>
          sale.client.company._id.toString() === usercompany._id.toString(),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, 'Error getting sales'),
      );
    }

    const result = {
      list: sales,
      count: sales.length,
    };
    return result;
  };

  /**
   * create a new sale
   * @static
   * @since 1.0.0
   * @param {SaleDTO} saleDTO the sale DTO object
   * @return {Promise<ISale>}  a promise of ISale
   * @throws 400 error, Can't create the new sale
   */
  static createSale = async (
    saleDTO: SaleDTO,
    connectedUser?: IUser,
  ): Promise<ISale> => {
    try {
      const sale: ISale = new Sale();
      sale.finalPrice = saleDTO.finalPrice;
      sale.recurringPaymentDay = saleDTO.recurringPaymentDay;
      sale.isActivated = saleDTO.isActivated;
      const soldBy: IUser = new User();
      soldBy._id = saleDTO.soldBy;
      const product: IProduct = new Product();
      product._id = saleDTO.productId;
      const paymentPlan: IPaymentPlan = new PaymentPlan();
      paymentPlan._id = saleDTO.paymentPlanId;
      const client: IClient = new Client();
      client._id = saleDTO.clientId;

      sale.product = product;
      sale.paymentPlan = paymentPlan;
      sale.client = client;
      sale.soldBy = soldBy;

      sale.createdBy = connectedUser;
      return Sale.create(sale);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new sale",
        ),
      );
    }
  };

  /**
   * update sale
   * @static
   * @since 1.0.0
   * @param {uuid} id sale id must be a valid uuid
   * @param {SaleDTO} saleDTO sale dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, sale not found message
   */
  static updateSale = async (
    id: string,
    saleDTO: SaleDTO,
    connectedUser?: IUser,
  ): Promise<ISale> => {
    try {
      const sale: ISale | null = await Sale.findById(id);
      if (sale) {
        sale.finalPrice = saleDTO.finalPrice;
        sale.recurringPaymentDay = saleDTO.recurringPaymentDay;
        sale.isActivated = saleDTO.isActivated;
        const soldBy: IUser = new User();
        soldBy._id = saleDTO.soldBy;
        const product: IProduct = new Product();
        product._id = saleDTO.productId;
        const paymentPlan: IPaymentPlan = new PaymentPlan();
        paymentPlan._id = saleDTO.paymentPlanId;
        const client: IClient = new Client();
        client._id = saleDTO.clientId;

        sale.product = product;
        sale.paymentPlan = paymentPlan;
        sale.client = client;
        sale.soldBy = soldBy;
        sale.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Sale.findByIdAndUpdate({ _id: id }, sale);

        if (!updated) throw 'Error';

        updated = await SalesService.getSale(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Error, Can't update the new sale",
        ),
      );
    }
  };

  /**
   * delete sale
   * @static
   * @since 1.0.0
   * @param {uuid} id sale id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, sale not found message
   * @throws 403 error, can't remove this sale that's used with other entities
   */
  static deleteSale = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const sale: ISale | null = await Sale.findById(id);
      if (sale) {
        return Sale.deleteOne({ _id: id });
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'sale not exist'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, error.toString()),
      );
    }
  };

  /**
   * get sales count by payment plan id
   * @static
   * @since 1.0.0
   * @param {uuid} id payment plan id must be a valid uuid
   * @return {Promise<number>} a promise of count number
   */
  static getSalesCountByPaymentPlan = async (
    paymentPlanId: string,
  ): Promise<number> => {
    const paymentPlan: IPaymentPlan = new PaymentPlan();
    // eslint-disable-next-line no-underscore-dangle
    paymentPlan._id = paymentPlanId;
    return Sale.countDocuments({ paymentPlan });
  };

  /**
   * get sales count by product id
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @return {Promise<number>} a promise of count number
   */
  static getProjectsCountByProduct = async (
    productId: string,
  ): Promise<number> => {
    const product: IProduct = new Product();
    // eslint-disable-next-line no-underscore-dangle
    product._id = productId;
    return Sale.countDocuments({ product });
  };
}
