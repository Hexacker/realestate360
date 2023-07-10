/* eslint-disable no-unused-expressions */
import ProductGroup from './productGroup.model';
import IProductGroup from './productGroup.interface';
import { IProject, Project, ProjectsService } from '../projects';
import ProductGroupDTO from './dto/productGroup.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { IProduct, Product } from '../products';
import { IUser } from '../users';
import { CompaniesService, ICompany } from '../companies';

export default class ProductGroupsService {
  /**
   * create a new product Group
   * @static
   * @since 1.0.0
   * @param {ProductGroupDTO} ProductGroupDTO the product Group DTO object
   * @return {Promise<IProductGroup>}  a promise of IProductGroup
   * @throws 400 error, Can't create the new product Group
   */
  static createGroupProduct = async (
    productGroupDTO: ProductGroupDTO,
    connectedUser?: IUser,
  ): Promise<IProductGroup> => {
    try {
      const group: IProductGroup = new ProductGroup();
      // eslint-disable-next-line no-underscore-dangle
      const {
        name,
        quantity,
        isActivated = true,
        projectId,
        parentId,
      } = productGroupDTO;

      group.name = name;
      group.quantity = quantity;
      group.isActivated = isActivated;

      const project = await ProjectsService.getProject(projectId);
      project && (group.project = project);

      if (parentId) {
        const parent = await ProductGroupsService.getProductGroup(parentId);
        parent && (group.parent = parent);
      }

      group.createdBy = connectedUser;
      ProductGroup.create(group);

      return group;
    } catch (error) {
      console.log(' ERR ==>  ', error);
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new product group",
        ),
      );
    }
  };

  /**
   * update product
   * @static
   * @since 1.0.0
   * @param {uuid} id product group id must be a valid uuid
   * @param {ProductGroupDTO} ProductGroupDTO product group dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, Group not found message
   */
  static updateGroupProduct = async (
    id: string,
    groupDTO: ProductGroupDTO,
    connectedUser?: IUser,
  ): Promise<IProductGroup> => {
    try {
      const group: IProductGroup | null = await ProductGroup.findById(id);
      if (group) {
        const {
          name,
          quantity,
          isActivated = true,
          projectId,
          parentId,
        } = groupDTO;

        group.name = name;
        group.quantity = quantity;
        group.isActivated = isActivated;

        const project = await ProjectsService.getProject(projectId);
        project && (group.project = project);

        if (parentId) {
          const parent = await ProductGroupsService.getProductGroup(parentId);
          parent && (group.parent = parent);
        }

        group.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await ProductGroup.findByIdAndUpdate({ _id: id }, group);

        if (!updated) throw 'Error';

        updated = await ProductGroupsService.getProductGroup(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Group not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.BAD_REQUEST, "Group can't be updated"),
      );
    }
  };

  /**
   * delete product
   * @static
   * @since 1.0.0
   * @param {uuid} id product group id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, product group not found message
   * @throws 403 error, can't remove this product group that's used with other entities
   */
  static deleteProductGroup = async (
    id: string,
  ): Promise<DeleteFromDatabase> => {
    try {
      const group: IProductGroup | null = await ProductGroup.findById({
        _id: id,
      });
      if (group) {
        const atLeastOneChild: IProductGroup | null = await ProductGroup.findOne(
          {
            parent: group,
          },
        );

        const atLeastOneProduct: IProduct | null = await Product.findOne({
          group,
        });

        if (atLeastOneChild || atLeastOneProduct) {
          throw new Error(
            `can't remove this product group that's used with other entities`,
          );
        }

        return ProductGroup.deleteOne({ _id: id });
      }

      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Group not exist'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
  };

  /**
   *
   * @param id
   * @returns
   */
  static getProductGroup = async (id: string): Promise<IProductGroup> => {
    try {
      const product = await ProductGroup.findById(id)
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'project',
          populate: { path: 'company' },
        })
        .populate('paymentPlan')
        .populate('client');

      if (!product) throw 'Error';

      return product;
    } catch {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    }
  };

  static getProducts = async (
    productGroup: IProductGroup,
  ): Promise<IProduct[]> => {
    try {
      const products = await Product.find({ group: productGroup })
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

      return products;
    } catch (err) {
      console.log(err);
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    }
  };

  static getCompanyProductGroup = async (
    company: ICompany,
  ): Promise<IProductGroup[]> => {
    try {
      const query = await ProductGroup.find({
        // 'project.company': company,
      })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'project',
          populate: { path: 'company' },
        })
        .populate('paymentPlan')
        .populate('client');

      const companyGroups = query.filter(
        group =>
          group.project.company._id.toString() === company._id.toString(),
      );

      return companyGroups;
    } catch {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    }
  };

  static getProjectProductGroup = async (
    project: IProject,
  ): Promise<IProductGroup[]> => {
    try {
      const query = await ProductGroup.find({
        // 'group.project': project,
      })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'project',
          populate: { path: 'company' },
        })
        .populate('paymentPlan')
        .populate('client');

      const companyGroups = query.filter(
        group => group.project._id.toString() === project._id.toString(),
      );

      return companyGroups;
    } catch {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'product not found'),
      );
    }
  };

  /**
   * get Product Groups count by project id
   * @static
   * @since 1.0.0
   * @param {uuid} id project id must be a valid uuid
   * @return {Promise<number>} a promise of number
   * @TODO add rquest
   */
  static getProductGroupsCountUsingProject = async (
    projectId: string,
  ): Promise<number> => {
    const project: IProject = new Project();
    project._id = projectId;
    ProductGroup.countDocuments({ project });
    return 0;
  };

  /**
   * get all products Groups with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IProductGroup[]; count: number }>} a promise of { list: IProductGroup[]; count: number }
   * @throws 404 error
   */
  static listAllProductsGroups = async (
    connectedUser: IUser,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IProductGroup[];
    count: number;
  }> => {
    const { list } = await CompaniesService.getUserCompanies(connectedUser._id);

    const usercompany: ICompany | null = list.length > 0 ? list[0] : null;

    if (!usercompany) throw 'Error';

    let groups: IProductGroup[] = [];
    try {
      const query = await ProductGroup.find()
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        })
        .populate({
          path: 'soldBy',
          select: '-password -roles',
        })
        .populate({
          path: 'project',
          populate: { path: 'company' },
        })
        .populate('paymentPlan')
        .populate('client');

      groups = query.filter(
        group =>
          group.project.company._id.toString() === usercompany._id.toString(),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'products not found'),
      );
    }

    const result = {
      list: groups,
      count: groups.length,
    };

    return result;
  };
}
