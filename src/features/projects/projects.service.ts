/* eslint-disable no-unused-expressions */
import Project from './project.model';
import IProject from './project.interface';
import { Company, ICompany } from '../companies';
import { IProduct, Product } from '../products';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { ProjectDTO } from '.';
import { IProjectCategory, ProjectCategory } from '../projectCategories';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { ProductGroupsService } from '../productGroups';
import { Country, ICountry } from '../countries';
import { IUser, User } from '../users';
import { userCompaniesProjectsStages } from './agregations/projects.pips';
import { companiesProjectsStages } from '../companies/agreggations/project.agreggate';

export default class ProjectsService {
  /**
   * find project by id
   * @static
   * @since 1.0.0
   * @param {uuid} id project id must be a valid uuid
   * @return {Promise<IProject | null>} a promise of IProject or null
   * @throws 404 error, project not found message
   */
  static getProject = async (id: string): Promise<IProject> => {
    try {
      const project: IProject | null = await Project.findById(id)
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'country',
        })
        .populate({
          path: 'products',
          populate: { path: 'group', model: 'ProductGroup' },
        })
        .populate({
          path: 'categories',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!project) throw 'Error';
      
      return project;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'project not found'),
      );
    }
  };

  /**
   * get all company projects with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @param {number} companyId companyId to be find
   * @return {Promise<{ list: IUser[]; count: number }>} a promise of { list: IUser[]; count: number }
   * @throws 404 error
   */
  static getCompanysProjects = async (
    companyId: string,
    limit?: number,
    skip?: number,
  ): Promise<{
    count: number;
    list: IProject[];
  }> => {
    try {
      const company: ICompany | null = await Company.findById(companyId);
      if (company) {
        const pipeline: any[] = companiesProjectsStages(companyId, limit, skip);

        const results = await Company.aggregate(pipeline);

        return {
          count: results[0] ? results[0].totalCount : 0,
          list: results[0] ? results[0].docs : [],
        };
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Company not found'),
      );
    } catch (error) {
      console.error(error);
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error getting company projects',
        ),
      );
    }
  };

  /**
   * find all user's projects in all their companies by userId
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<IProject | null>} a promise of IProject[] or null
   * @throws 404 error, user not found message
   */
  static getUserCompanyProjects = async (
    id: string | null,
    iUser?: IUser,
    limit?: number,
    skip?: number,
  ): Promise<{
    count: number;
    list: IProject[];
  }> => {
    try {
      const user: IUser | null | undefined = id
        ? await User.findById(id)
        : iUser;

      if (!user)
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
        );

      const results = await Company.aggregate(
        userCompaniesProjectsStages(user._id, limit, skip),
      );

      return {
        count: results[0] ? results[0].totalCount : 0,
        list: results[0] ? (results[0].docs as IProject[]) : [],
      };
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.NOT_FOUND,
          'Error getting user projects',
        ),
      );
    }
  };

  /**
   * Find all projects created by user by userId
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<IProject | null>} a promise of IProject[] or null
   * @throws 404 error, user not found message
   */
  static getProjectsCreatedByUser = async (
    id: string | null,
    iUser?: IUser,
  ): Promise<IProject[]> => {
    try {
      const user: IUser | null | undefined = id
        ? await User.findById(id)
        : iUser;

      if (!user)
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
        );

      const projectsCreatedByUser: IProject[] = await Project.find({
        createdBy: iUser,
      });

      return projectsCreatedByUser;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    }
  };

  /**
   * get all projects with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IProject[]; count: number }>} a promise of { list: IProject[]; count: number }
   * @throws 404 error
   */
  static listAllProjects = async (
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IProject[];
    count: number;
  }> => {
    const count: number = await Project.countDocuments();
    // console.log('counter ====> ', count);
    let projects: IProject[] = [];
    try {
      const query = Project.find()
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'country',
        })
        .populate({
          path: 'products',
          populate: { path: 'group', model: 'ProductGroup' },
        })
        .populate({
          path: 'categories',
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
        projects = await query.limit(limit).skip(skip);
      } else {
        projects = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'projects not found'),
      );
    }

    const result = {
      list: projects,
      count,
    };
    return result;
  };

  /**
   * create a new project
   * @static
   * @since 1.0.0
   * @param {ProjectDTO} projectDTO the project DTO object
   * @return {Promise<IProject>}  a promise of IProject
   * @throws 400 error, Can't create the new project
   */
  static createProject = async (
    projectDTO: ProjectDTO,
    connectedUser?: IUser,
  ): Promise<IProject> => {
    try {
      const project: IProject = new Project();
      project.name = projectDTO.name;
      project.city = projectDTO.city;
      project.address = projectDTO.address;
      project.state = projectDTO.state;
      project.areaTotal = projectDTO.areaTotal;
      project.currency = projectDTO.currency;
      project.isActivated = projectDTO.isActivated;
      // company
      const company: ICompany = new Company();
      company._id = projectDTO.companyId;
      project.company = company;
      // country
      const country: ICountry = new Country();
      country._id = projectDTO.countryId;
      project.country = country;
      // products
      const products: IProduct[] | undefined =
        projectDTO.products &&
        projectDTO.products.map(productId => {
          const product: IProduct = new Product();
          product._id = productId;
          return product;
        });
      project.products = products || [];
      // categories
      const productCategories: IProjectCategory[] = projectDTO.categories.map(
        categoryId => {
          const category: IProjectCategory = new ProjectCategory();
          category._id = categoryId;
          return category;
        },
      );
      project.categories = productCategories || [];

      project.createdBy = connectedUser;
      return Project.create(project);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new project",
        ),
      );
    }
  };

  /**
   * update project
   * @static
   * @since 1.0.0
   * @param {uuid} id project id must be a valid uuid
   * @param {ProjectDTO} projectDTO project dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, project not found message
   */
  static updateProject = async (
    id: string,
    projectDTO: ProjectDTO,
    connectedUser?: IUser,
  ): Promise<IProject> => {
    try {
      const project: IProject | null = await Project.findById(id);
      if (project) {
        project.name = projectDTO.name;
        project.city = projectDTO.city;
        project.address = projectDTO.address;
        project.state = projectDTO.state;
        project.areaTotal = projectDTO.areaTotal;
        project.currency = projectDTO.currency;
        project.isActivated = projectDTO.isActivated;
        // company
        const company: ICompany = new Company();
        company._id = projectDTO.companyId;
        project.company = company;
        // country
        const country: ICountry = new Country();
        country._id = projectDTO.countryId;
        project.country = country;
        // products
        const products: IProduct[] | undefined =
          projectDTO.products &&
          projectDTO.products.map(productId => {
            const product: IProduct = new Product();
            product._id = productId;
            return product;
          });
        project.products = products || [];
        // categories
        const productCategories: IProjectCategory[] = projectDTO.categories.map(
          categoryId => {
            const category: IProjectCategory = new ProjectCategory();
            category._id = categoryId;
            return category;
          },
        );
        project.categories = productCategories || [];
        project.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Project.findByIdAndUpdate({ _id: id }, project);

        if (!updated) throw 'Error';

        updated = await ProjectsService.getProject(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'project not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't update the new project",
        ),
      );
    }
  };

  /**
   * delete project
   * @static
   * @since 1.0.0
   * @param {uuid} id project id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, project not found message
   * @throws 403 error, can't remove this project that's used with other entities
   */
  static deleteProject = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const project: IProject | null = await Project.findById(id);
      if (project) {
        const usersCount: number = await ProductGroupsService.getProductGroupsCountUsingProject(
          id,
        );
        if (usersCount !== 0) {
          throw new Error(
            `can't remove this project that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'project not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return Project.deleteOne({ _id: id });
  };

  /**
   * get projects count by company id
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<number>} a promise of number
   */
  static getProjectsCountByCompany = async (
    companyId: string,
  ): Promise<number> => {
    const company: ICompany = new Company();
    // eslint-disable-next-line no-underscore-dangle
    company._id = companyId;
    return Project.countDocuments({ company });
  };

  /**
   * get projects count by product id
   * @static
   * @since 1.0.0
   * @param {uuid} id product id must be a valid uuid
   * @return {Promise<number>} a promise of number
   */
  static getProjectsCountByProduct = async (
    productId: string,
  ): Promise<number> => {
    const product: IProduct = new Product();
    // eslint-disable-next-line no-underscore-dangle
    product._id = productId;
    return Project.countDocuments({ product });
  };

  /**
   * get projects count by project category id
   * @static
   * @since 1.0.0
   * @param {uuid} id project category id must be a valid uuid
   * @return {Promise<number>} a promise of number
   */
  static getProjectsCountByProjectCategory = async (
    projectCategoryId: string,
  ): Promise<number> => {
    const projectCategory: IProduct = new Product();
    // eslint-disable-next-line no-underscore-dangle
    projectCategory._id = projectCategoryId;
    return Project.countDocuments({ projectCategory });
  };
}
