/* eslint-disable no-unused-expressions */
import mongoose from 'mongoose';
import Product from './product.model';
import IProduct from './product.interface';
import { HttpStatusEnum } from '../../shared';
import HttpException from '../../exceptions/httpException';
import { ProductDTO } from '.';
import { IProductGroup, ProductGroup } from '../productGroups';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { QuotesService } from '../quotes';
import { SalesService } from '../sales';
import { ProjectsService } from '../projects';
import { IUser } from '../users';
import { CompaniesService, ICompany } from '../companies';

export default class ProductsService {
  /**
   * find product by id
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @return {Promise<IProduct | null>} a promise of IProduct or null
   * @throws 404 error, product not found message
   */
  static getProduct = async (id: string): Promise<IProduct> => {
    try {
      const product = await Product.findById(id)
        .populate({
          path: 'group',
          populate: { path: 'project' },
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!product) throw 'Error';

      return product;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    }
  };

  /**
   * get all products with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IProduct[]; count: number }>} a promise of { list: IProduct[]; count: number }
   * @throws 404 error
   */
  static listAllProducts = async (
    connectedUser: IUser,
    usercompany: ICompany,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IProduct[];
    count: number;
  }> => {
    let products: IProduct[] = [];
    try {
      const query = await Product.find({})
        .populate({
          path: 'group',
          populate: { path: 'project', populate: { path: 'company' } },
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      products = query.filter(
        product =>
          product.group.project.company._id.toString() ===
          usercompany._id.toString(),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'products not found'),
      );
    }

    const result = {
      list: products,
      count: products.length,
    };
    return result;
  };

  /**
   * create a new product
   * @static
   * @since 1.0.0
   * @param {ProductDTO} productDTO the product DTO object
   * @return {Promise<IProduct>}  a promise of IProduct
   * @throws 400 error, Can't create the new product
   */
  static createProduct = async (
    productDTO: ProductDTO,
    connectedUser?: IUser,
  ): Promise<IProduct> => {
    try {
      const product: IProduct = new Product();
      product.price = productDTO.price;
      product.salePrice = productDTO.salePrice;
      product.areaTotal = productDTO.areaTotal;
      product.attachment = productDTO.attachment;
      product.perimeter = productDTO.perimeter;
      product.status = productDTO.status;
      product.isActivated = productDTO.isActivated;
      const group: IProductGroup = new ProductGroup();
      // eslint-disable-next-line no-underscore-dangle
      group._id = productDTO.groupId;
      product.group = group;
      product.createdBy = connectedUser;
      return Product.create(product);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new product",
        ),
      );
    }
  };

  /**
   * update product
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @param {ProductDTO} productDTO product dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, product not found message
   */
  static updateProduct = async (
    id: string,
    productDTO: ProductDTO,
    connectedUser?: IUser,
  ): Promise<IProduct> => {
    try {
      const product: IProduct | null = await Product.findById(id);
      if (product) {
        product.price = productDTO.price;
        product.salePrice = productDTO.salePrice;
        product.areaTotal = productDTO.areaTotal;
        product.attachment = productDTO.attachment;
        product.isActivated = productDTO.isActivated;
        const group: IProductGroup = new ProductGroup();
        // eslint-disable-next-line no-underscore-dangle
        group._id = productDTO.groupId;
        product.group = group;
        product.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Product.findByIdAndUpdate({ _id: id }, product);

        if (!updated) throw 'Error';

        updated = await ProductsService.getProduct(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "product Can't be updated",
        ),
      );
    }
  };

  /**
   * delete product
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, product not found message
   * @throws 403 error, can't remove this product that's used with other entities
   */
  static deleteProduct = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const product: IProduct | null = await Product.findById(id);
      if (product) {
        const quotesCount: number = await QuotesService.getRolesCountByProduct(
          id,
        );
        const projectsCount: number = await ProjectsService.getProjectsCountByProduct(
          id,
        );
        const salesCount: number = await SalesService.getProjectsCountByProduct(
          id,
        );
        if (quotesCount + projectsCount + salesCount !== 0) {
          throw new Error(
            `can't remove this product that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'product not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return Product.deleteOne({ _id: id });
  };
}
