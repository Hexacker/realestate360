/* eslint-disable no-unused-expressions */

import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { ProjectCategoryDTO, IProjectCategory, ProjectCategory } from '.';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { ProjectsService } from '../projects';
import { IUser } from '../users';
import { CompaniesService, ICompany } from '../companies';

export default class ProjectCategoriesService {
  /**
   * find project category  by id
   * @static
   * @since 1.0.0
   * @param {uuid} id project category  id must be a valid uuid
   * @return {Promise<IProjectCategory | null>} a promise of IProjectCategory or null
   * @throws 404 error, project category  not found message
   */
  static getProjectCategory = async (id: string): Promise<IProjectCategory> => {
    try {
      const projectCateg = await ProjectCategory.findById(id)
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

      if (!projectCateg) throw 'Error';

      return projectCateg;
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.NOT_FOUND,
          'project category not found',
        ),
      );
    }
  };

  static getCompanyProjectCategory = async (
    companyId: string,
  ): Promise<{
    list: IProjectCategory[];
    count: number;
  }> => {
    try {
      const company = await CompaniesService.getCompany(companyId);

      const companyCategories = await ProjectCategory.find({ company });

      return {
        list: companyCategories,
        count: companyCategories.length,
      };
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.NOT_FOUND,
          'project category not found',
        ),
      );
    }
  };

  /**
   * get all project categories with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IProjectCategory[]; count: number }>} a promise of { list: IProjectCategory[]; count: number }
   * @throws 404 error
   */
  static listAllProjectCategories = async (
    connectedUser: IUser,
  ): Promise<{
    list: IProjectCategory[];
    count: number;
  }> => {
    try {
      const { list } = await CompaniesService.getUserCompanies(
        connectedUser._id,
      );

      const usercompany: ICompany | null = list.length > 0 ? list[0] : null;

      if (!usercompany) throw 'Error';

      let projectCategories: IProjectCategory[] = [];

      const { list: projects } = await ProjectsService.getCompanysProjects(
        usercompany._id,
      );

      // eslint-disable-next-line no-restricted-syntax
      for (const project of projects)
        projectCategories = projectCategories.concat(project.categories);

      return {
        list: projectCategories,
        count: projectCategories.length,
      };
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error getting project categories',
        ),
      );
    }
  };

  /**
   * create a new project category
   * @static
   * @since 1.0.0
   * @param {ProjectCategoryDTO} ProjectCategoryDTO the project category DTO object
   * @return {Promise<IProjectCategory>}  a promise of IProjectCategory
   * @throws 400 error, Can't create the new project category
   */
  static createProjectCategory = async (
    projectCategoriesDTO: ProjectCategoryDTO,
    connectedUser?: IUser,
  ): Promise<IProjectCategory> => {
    try {
      const company = await CompaniesService.getCompany(
        projectCategoriesDTO.companyId,
      );

      if (!company)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Company ID'),
        );

      const projectCategory: IProjectCategory = new ProjectCategory();
      const { name, isActivated } = projectCategoriesDTO;
      projectCategory.name = name;
      projectCategory.isActivated = isActivated;
      projectCategory.createdBy = connectedUser;
      projectCategory.company = company;

      return ProjectCategory.create(projectCategory);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new projectCategory",
        ),
      );
    }
  };

  /**
   * update project category
   * @static
   * @since 1.0.0
   * @param {uuid} id project category  id must be a valid uuid
   * @param {ProjectCategoryDTO} projectCategoriesDTO project category DTO
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, project category not found message
   */
  static updateProjectCategory = async (
    id: string,
    projectCategoriesDTO: ProjectCategoryDTO,
    connectedUser: IUser,
  ): Promise<IProjectCategory> => {
    try {
      await ProjectCategoriesService.hasPermissionOn(id, connectedUser);

      const projectCategory: IProjectCategory | null = await ProjectCategory.findById(
        id,
      );
      if (projectCategory) {
        const { name, isActivated } = projectCategoriesDTO;
        projectCategory.name = name;
        projectCategory.isActivated = isActivated;
        projectCategory.lastUpdatedBy = connectedUser;
        let updated: any;

        updated = await ProjectCategory.findByIdAndUpdate(
          { _id: id },
          projectCategory,
        );

        if (!updated) throw 'Error';

        updated = await ProjectCategoriesService.getProjectCategory(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.NOT_FOUND,
          'project category not found',
        ),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't update the new project category",
        ),
      );
    }
  };

  /**
   * delete project category
   * @static
   * @since 1.0.0
   * @param {uuid} id project category id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, project category not found message
   * @throws 403 error, can't remove this project category that's used with other entities
   */
  static deleteProjectCategory = async (
    id: string,
    connectedUser: IUser,
  ): Promise<DeleteFromDatabase> => {
    try {
      await ProjectCategoriesService.hasPermissionOn(id, connectedUser);

      const projectCategory: IProjectCategory | null = await ProjectCategory.findById(
        id,
      );
      if (projectCategory) {
        const projectsCount: number = await ProjectsService.getProjectsCountByProjectCategory(
          id,
        );
        if (projectsCount !== 0) {
          throw new Error(
            `can't remove this projectCategory that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(
            HttpStatusEnum.NOT_FOUND,
            'project category not exist',
          ),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return ProjectCategory.deleteOne({ _id: id });
  };

  static hasPermissionOn = async (
    categId: string,
    connectedUser: IUser,
  ): Promise<boolean> => {
    const {
      list: categories,
    } = await ProjectCategoriesService.listAllProjectCategories(connectedUser);

    // eslint-disable-next-line no-restricted-syntax
    for (const cat of categories) {
      if (cat._id.toString() === categId.toString()) return true;
    }

    return Promise.reject(
      new HttpException(HttpStatusEnum.FORBIDDEN, 'User not authaurized'),
    );
  };
}
