/* eslint-disable no-underscore-dangle */
import Quote from './quote.model';
import IQuote from './quote.interface';
import { IPaymentPlan, PaymentPlan } from '../paymentPlans';
import { IProduct, Product } from '../products';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { QuoteDTO } from '.';
import { IUser, User } from '../users';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { CompaniesService, ICompany } from '../companies';

export default class QuotesService {
  /**
   * find quote by id
   * @static
   * @since 1.0.0
   * @param {uuid} id quote id must be a valid uuid
   * @return {Promise<IQuote | null>} a promise of IQuote or null
   * @throws 404 error, quote not found message
   */
  static getQuote = async (id: string): Promise<IQuote> => {
    try {
      const quote = await Quote.findById(id)
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        });

      if (!quote) throw 'Error';

      return quote;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'quote not found'),
      );
    }
  };

  static getProductQuotes = async (product: IProduct): Promise<IQuote[]> => {
    try {
      const quotes = await Quote.find({ product })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: { path: 'group' },
        });

      if (!quotes) throw 'Error';

      return quotes;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'quote not found'),
      );
    }
  };

  /**
   * get all quotes with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IQuote[]; count: number }>} a promise of { list: IQuote[]; count: number }
   * @throws 404 error
   */
  static listAllQuotes = async (
    connectedUser: IUser,
    usercompany: ICompany,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IQuote[];
    count: number;
  }> => {
    let quotes: IQuote[] = [];
    try {
      const query = await Quote.find()
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'paymentPlan',
        })
        .populate({
          path: 'product',
          populate: {
            path: 'group',
            populate: { path: 'project', populate: { path: 'company' } },
          },
        });

      quotes = query.filter(
        quote =>
          quote.product.group.project.company._id.toString() ===
          usercompany._id.toString(),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, 'Error getting quotes'),
      );
    }

    const result = {
      list: quotes,
      count: quotes.length,
    };
    return result;
  };

  /**
   * create a new quote
   * @static
   * @since 1.0.0
   * @param {QuoteDTO} quoteDTO the quote DTO object
   * @return {Promise<IQuote>}  a promise of IQuote
   * @throws 400 error, Can't create the new quote
   */
  static createQuote = async (
    quoteDTO: QuoteDTO,
    connectedUser?: IUser,
  ): Promise<IQuote> => {
    try {
      const quote: IQuote = new Quote();
      quote.price = quoteDTO.price;
      quote.isActivated = quoteDTO.isActivated;
      const createdBy: IUser = new User();
      createdBy._id = quoteDTO.createdBy;
      const product: IProduct = new Product();
      product._id = quoteDTO.productId;
      quote.product = product;
      const paymentPlan: IPaymentPlan = new PaymentPlan();
      paymentPlan._id = quoteDTO.paymentPlanId;
      quote.paymentPlan = paymentPlan;
      quote.createdBy = connectedUser;
      return Quote.create(quote);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new quote",
        ),
      );
    }
  };

  /**
   * update quote
   * @static
   * @since 1.0.0
   * @param {uuid} id quote id must be a valid uuid
   * @param {QuoteDTO} quoteDTO quote dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, quote not found message
   */
  static updateQuote = async (
    id: string,
    quoteDTO: QuoteDTO,
    connectedUser?: IUser,
  ): Promise<IQuote> => {
    try {
      const quote: IQuote | null = await Quote.findById(id);
      if (quote) {
        quote.price = quoteDTO.price;
        quote.isActivated = quoteDTO.isActivated;
        const createdBy: IUser = new User();
        createdBy._id = quoteDTO.createdBy;
        const product: IProduct = new Product();
        product._id = quoteDTO.productId;
        quote.product = product;
        const paymentPlan: IPaymentPlan = new PaymentPlan();
        paymentPlan._id = quoteDTO.paymentPlanId;
        quote.paymentPlan = paymentPlan;
        quote.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Quote.findByIdAndUpdate({ _id: id }, quote);

        if (!updated) throw 'Error';

        updated = await QuotesService.getQuote(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'quote not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Error, Can't update the new quote",
        ),
      );
    }
  };

  /**
   * delete quote
   * @static
   * @since 1.0.0
   * @param {uuid} id quote id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, quote not found message
   * @throws 403 error, can't remove this quote that's used with other entities
   */
  static deleteQuote = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const quote: IQuote | null = await Quote.findById(id);
      if (quote) {
        return Quote.deleteOne({ _id: id });
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'quote not exist'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, error.toString()),
      );
    }
  };

  /**
   * get quotes count by payment plan id
   * @static
   * @since 1.0.0
   * @param {uuid} id payment plan id must be a valid uuid
   * @return {Promise<number>} a promise of count number
   */
  static getQuotesCountByPaymentPlan = async (
    paymentPlanId: string,
  ): Promise<number> => {
    const paymentPlan: IPaymentPlan = new PaymentPlan();
    // eslint-disable-next-line no-underscore-dangle
    paymentPlan._id = paymentPlanId;
    return Quote.countDocuments({ paymentPlan });
  };

  /**
   * get quotes count by product id
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @return {Promise<number>} a promise of count number
   */
  static getRolesCountByProduct = async (
    productId: string,
  ): Promise<number> => {
    const product: IProduct = new Product();
    // eslint-disable-next-line no-underscore-dangle
    product._id = productId;
    return Quote.countDocuments({ product });
  };
}
