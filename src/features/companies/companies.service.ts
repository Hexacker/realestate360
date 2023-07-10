/* eslint-disable no-unused-expressions */
/* eslint-disable no-underscore-dangle */
import Company from './company.model';
import ICompany from './company.interface';
import { CompanyDTO } from '.';
import { IUser, User, UsersService } from '../users';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { RolesService } from '../roles';
import { BankAccountsService } from '../bankAccounts';
import { ProjectsService } from '../projects';
import { ClientsService } from '../clients';
import { companyAdmins } from './agreggations/admins.agreggate';
import { userCompaniesStages } from '../projects/agregations/projects.pips';

export default class CompaniesService {
  /**
   * find company by id
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<ICompany | null>} a promise of ICompany or null
   * @throws 404 error, company not found message
   */
  static getCompany = async (id: string): Promise<ICompany> => {
    try {
      const company: ICompany | null = await Company.findById(id)
        .populate({
          path: 'admins',
          select: '-password',
          populate: { path: 'roles', model: 'Role' },
        })
        .populate({
          path: 'createdBy',
          select: '-password',
          populate: { path: 'roles', model: 'Role' },
        });

      if (!company) throw 'Error';

      return company;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'company not found'),
      );
    }
  };

  /**
   * find all user's companies by userId
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<ICompany | null>} a promise of ICompany[] or null
   * @throws 404 error, user not found message
   */
  static getUserCompanies = async (
    iUser: IUser | string | null,
    limit?: number,
    skip?: number,
  ): Promise<{
    count: number;
    list: ICompany[];
  }> => {
    try {
      const user: IUser | null =
        typeof iUser === 'string' ? await User.findById(iUser) : iUser;

      if (!user)
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
        );

      const results = await Company.aggregate(
        userCompaniesStages(user._id, limit, skip),
      );

      const companies: ICompany[] = results[0] ? results[0].docs : [];

      const companiesIdSet: string[] = [];

      companies.map(company => companiesIdSet.push(company._id.toString()));

      const connectedUser = await UsersService.getUser(user._id);
      const userCompanies = connectedUser.roles.map(role => role.company);

      userCompanies.forEach(company => {
        if (!companiesIdSet.includes(company._id.toString())) {
          companiesIdSet.push(company._id.toString());
          companies.push(company);
        }
      });

      return {
        count: companies.length,
        list: companies,
      };
    } catch (error) {
      console.error(error);
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    }
  };

  /**
   * get all companies with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: ICompany[]; count: number }>} a promise of { list: ICompany[]; count: number }
   * @throws 404 error
   */
  static listAllCompanies = async (
    limit?: number,
    skip?: number,
  ): Promise<{
    list: ICompany[];
    count: number;
  }> => {
    const count: number = await Company.countDocuments();
    let companies: ICompany[] = [];
    try {
      const query = Company.find()
        .populate({
          path: 'admins',
          select: '-password -roles',
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
        companies = await query.limit(limit).skip(skip);
      } else {
        companies = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error getting companies',
        ),
      );
    }

    const result = {
      list: companies,
      count,
    };
    return result;
  };

  /**
   * create a new company
   * @static
   * @since 1.0.0
   * @param {CompanyDTO} companyDTO the company DTO object
   * @return {Promise<ICompany>}  a promise of ICompany
   * @throws 400 error, Can't create the new company
   */
  static createCompany = async (
    companyDTO: CompanyDTO,
    connectedUser?: IUser,
  ): Promise<ICompany> => {
    try {
      const company: ICompany = new Company();
      company.name = companyDTO.name;
      company.address = companyDTO.address;
      company.city = companyDTO.city;
      company.state = companyDTO.state;
      company.phone = companyDTO.phone;
      company.logoUrl = companyDTO.logoUrl;
      company.numEmployees = companyDTO.numEmployees;
      company.isActivated = companyDTO.isActivated;
      company.createdBy = connectedUser;
      const admins: IUser[] = companyDTO.admins.map(adminId => {
        const admin: IUser = new User();
        // eslint-disable-next-line no-underscore-dangle
        admin._id = adminId;
        return admin;
      });
      company.admins = admins || [];
      return Company.create(company);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new company",
        ),
      );
    }
  };

  /**
   * update company
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @param {CompanyDTO} companyDTO company dto
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, company not found message
   */
  static updateCompany = async (
    id: string,
    companyDTO: CompanyDTO,
    connectedUser?: IUser,
  ): Promise<ICompany> => {
    try {
      const company: ICompany | null = await Company.findById(id);
      if (company) {
        company.name = companyDTO.name;
        company.address = companyDTO.address;
        company.city = companyDTO.city;
        company.state = companyDTO.state;
        company.phone = companyDTO.phone;
        company.logoUrl = companyDTO.logoUrl;
        company.numEmployees = companyDTO.numEmployees;
        company.isActivated = companyDTO.isActivated;
        const admins: IUser[] = companyDTO.admins.map(adminId => {
          const admin: IUser = new User();
          // eslint-disable-next-line no-underscore-dangle
          admin._id = adminId;
          return admin;
        });
        company.admins = admins || [];
        company.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await Company.findByIdAndUpdate({ _id: id }, company);

        if (!updated) throw 'Error';

        updated = await CompaniesService.getCompany(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'company not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't update the new company",
        ),
      );
    }
  };

  /**
   * delete company
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, company not found message
   * @throws 403 error, can't remove this company that's used with other entities
   */
  static deleteCompany = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const company: ICompany | null = await Company.findById(id);
      if (company) {
        const rolesCount: number = await RolesService.getRolesCountByCompany(
          id,
        );
        const bankAccountsCount: number = await BankAccountsService.getBankAccountsCountByCompany(
          id,
        );
        const projectsCount: number = await ProjectsService.getProjectsCountByCompany(
          id,
        );
        const clientsCount: number = await ClientsService.getClientsCountByCompany(
          id,
        );
        if (
          rolesCount + bankAccountsCount + projectsCount + clientsCount !==
          0
        ) {
          throw new Error(
            `can't remove this company that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'company not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return Company.deleteOne({ _id: id });
  };

  /**
   * get all company users with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @param {number} companyId companyId to be find
   * @return {Promise<{ list: IUser[]; count: number }>} a promise of { list: IUser[]; count: number }
   * @throws 404 error
   */
  static listAllCompanyAdmins = async (
    companyId: string,
    limit?: number,
    skip?: number,
  ): Promise<{
    count: number;
    list: IUser[];
  }> => {
    try {
      const company: ICompany | null = await Company.findById(companyId);
      if (company) {
        const pipeline: any[] = await companyAdmins(companyId, limit, skip);
        const results = await Company.aggregate(pipeline);

        const list: IUser[] = results.map(res => {
          return { ...res.admin, password: '' };
        });

        return { count: results[0] ? results[0].totalCount : 0, list };
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Company not found'),
      );
    } catch (error) {
      console.log(error);
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error getting company admins',
        ),
      );
    }
  };

  static hasPermissionOn = async (
    companyId: string,
    userId: string,
  ): Promise<boolean> => {
    const { list: admins } = await CompaniesService.listAllCompanyAdmins(
      companyId,
    );

    const user = await UsersService.getUser(userId);

    const userRoles = user.roles;

    if (
      // connected user is not admin in this company
      (admins.every(admin => admin._id.toString() !== userId.toString()) ||
        admins.length === 0) &&
      // and connected user have no role in this company
      userRoles.every(
        role => role.company._id.toString() !== companyId.toString(),
      )
    )
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, 'User not authaurized'),
      );

    return true;
  };
}
