import Role from './role.model';
import IRole from './role.interface';
import { RoleDTO } from '.';
import { Company, ICompany } from '../companies';
import { HttpStatusEnum } from '../../shared';
import HttpException from '../../exceptions/httpException';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { IUser, UsersService } from '../users';

export default class RolesService {
  /**
   * find role by id
   * @static
   * @since 1.0.0
   * @param {uuid} id role id must be a valid uuid
   * @return {Promise<IRole | null>} a promise of IRole or null
   * @throws 404 error, role not found message
   */
  static getRole = async (id: string): Promise<IRole> => {
    try {
      const role = await Role.findById(id).populate({
        path: 'company',
      });

      if (!role) throw 'Error';

      return role;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'role not found'),
      );
    }
  };

  /**
   * get all roles with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IRole[]; count: number }>} a promise of { list: IRole[]; count: number }
   * @throws 404 error
   */
  static listAllRoles = async (
    company: ICompany,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IRole[];
    count: number;
  }> => {
    const count: number = await Role.countDocuments();
    let roles: IRole[] = [];
    try {
      const query = Role.find({
        company,
      }).populate({
        path: 'company',
      });
      if (limit !== undefined && skip !== undefined) {
        roles = await query.limit(limit).skip(skip);
      } else {
        roles = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'roles not found'),
      );
    }

    const result = {
      list: roles,
      count,
    };
    return result;
  };

  /**
   * create a new role
   * @static
   * @since 1.0.0
   * @param {RoleDTO} roleDTO the role DTO object
   * @return {Promise<IRole>}  a promise of IRole
   * @throws 400 error, Can't create the new role
   */
  static createRole = async (
    roleDTO: RoleDTO,
    connectedUser?: IUser,
  ): Promise<IRole> => {
    try {
      const role: IRole = new Role();
      role.name = roleDTO.name;
      const company: ICompany = new Company();
      // eslint-disable-next-line no-underscore-dangle
      company._id = roleDTO.companyId;
      role.company = company;
      role.permissions = roleDTO.permissions;
      role.isActivated = roleDTO.isActivated;
      role.createdBy = connectedUser;
      return Role.create(role);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new role",
        ),
      );
    }
  };

  /**
   * update role
   * @static
   * @since 1.0.0
   * @param {uuid} id role id must be a valid uuid
   * @param {RoleDTO} roleDTO role dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, role not found message
   */
  static updateRole = async (
    id: string,
    roleDTO: RoleDTO,
    connectedUser?: IUser,
  ): Promise<IRole> => {
    try {
      const role: IRole | null = await Role.findById(id);
      if (role) {
        role.name = roleDTO.name;
        const company: ICompany = new Company();
        // eslint-disable-next-line no-underscore-dangle
        company._id = roleDTO.companyId;
        role.company = company;
        role.permissions = roleDTO.permissions;
        role.isActivated = roleDTO.isActivated;
        role.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Role.findByIdAndUpdate({ _id: id }, role);

        if (!updated) throw 'Error';

        updated = await RolesService.getRole(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'role not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new role",
        ),
      );
    }
  };

  /**
   * delete role
   * @static
   * @since 1.0.0
   * @param {uuid} id role id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, role not found message
   * @throws 403 error, can't remove this role that's used with other entities
   */
  static deleteRole = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const role: IRole | null = await Role.findById(id);
      if (role) {
        const usersCount: number = await UsersService.getUsersCountUsingRole(
          id,
        );
        if (usersCount !== 0) {
          throw new Error(
            `can't remove this role that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'role not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return Role.deleteOne({ _id: id });
  };

  /**
   * get roles count by company id
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<number>} a promise of number
   */
  static getRolesCountByCompany = async (
    companyId: string,
  ): Promise<number> => {
    const company: ICompany = new Company();
    // eslint-disable-next-line no-underscore-dangle
    company._id = companyId;
    return Role.countDocuments({ company });
  };
}
