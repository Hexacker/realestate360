import * as bcrypt from 'bcrypt';
import User from './user.model';
import IUser from './user.interface';
import { UserDTO } from '.';
import { keys } from '../../utils/config';
import { IRole, Role } from '../roles';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { CompaniesService, Company } from '../companies';
import { Quote } from '../quotes';
import { Sale } from '../sales';
import UpdateUserDTO from './dto/updateUser.dto';

export default class UsersService {
  /**
   * find user by id
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<IUser | null>} a promise of IUser or null
   * @throws 404 error, user not found message
   */
  static getUser = async (id: string): Promise<IUser> => {
    try {
      const user = await User.findById(id)
        .populate({
          path: 'roles',
          select: '-password',
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

      if (!user) throw 'Error';

      return user;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    }
  };

  /**
   * create a new user
   * @static
   * @since 1.0.0
   * @param {UserDTO} userDTO the user DTO object
   * @return {Promise<IUser>}  a promise of IUser
   * @throws 400 error
   */
  static createUser = async (
    userDTO: UserDTO,
    connectedUser?: IUser,
  ): Promise<IUser> => {
    try {
      const user: IUser = new User();
      user.firstName = userDTO.firstName;
      user.lastName = userDTO.lastName;
      user.email = userDTO.email;
      user.isActivated = userDTO.isActivated;
      user.password = UsersService.hashPassword(userDTO.password);
      user.profilePicture = userDTO.profilePicture;
      let roles: IRole[] = await Role.find({ name: { $in: userDTO.roles } });
      if (!roles.length) roles = [];
      user.roles = roles;
      // should be created by an admin or by him self (signup)
      // if signup createBy will be undefined that will make the difference
      user.createdBy = connectedUser;

      return await User.create(user);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new user",
        ),
      );
    }
  };

  /**
   * update
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, user not found message
   */
  static updateUser = async (
    id: string,
    userDTO: UpdateUserDTO,
    connectedUser?: IUser,
  ): Promise<IUser> => {
    try {
      const user: IUser | null = await User.findById(id);
      if (user) {
        const emailExist: IUser | null = await UsersService.findUserByEmail(
          userDTO.email,
        );
        if (emailExist && user.email !== emailExist.email) {
          return Promise.reject(
            new HttpException(
              HttpStatusEnum.BAD_REQUEST,
              'Email already exist',
            ),
          );
        }
        user.firstName = userDTO.firstName;
        user.lastName = userDTO.lastName;
        user.profilePicture = userDTO.profilePicture;
        user.email = userDTO.email;
        user.isActivated = userDTO.isActivated;
        let roles: IRole[] = await Role.find({
          name: { $in: userDTO.roles },
        });
        if (!roles.length) roles = user.roles;
        user.roles = roles;
        user.lastUpdatedBy = connectedUser;

        let updated: any;

        updated = await User.findByIdAndUpdate({ _id: id }, user);

        if (!updated) throw 'Error';

        updated = await UsersService.getUser(id);

        if (!updated) throw 'Error';

        return updated;
      }
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Server error: can't update User",
        ),
      );
    }
  };

  /**
   * delete user
   * @static
   * @since 1.0.0
   * @param {uuid} id user id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, client not found message
   * @throws 403 error, can't remove this user that's used with other entities
   */
  static deleteUser = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      try {
        const user: IUser | null = await User.findById(id);
        if (user) {
          // check if this user is the admin of a registred company
          const atLeastOneCompany = await Company.findOne({
            admin: user,
          });

          // check if this user have create one quots
          const atLeastOneQuots = await Quote.findOne({
            createdBy: user,
          });

          // check if this user had make a sale
          const atLeastOneSale = await Sale.findOne({
            soldBy: user,
          });

          /**
           * @TODO
           * check if this user create other untities
           *  after add Createdby in others untities
           *
           */

          if (atLeastOneCompany || atLeastOneQuots || atLeastOneSale) {
            throw new Error(
              `can't remove this user that's used with other entities`,
            );
          }
        } else {
          return Promise.reject(
            new HttpException(HttpStatusEnum.NOT_FOUND, 'user not exist'),
          );
        }
      } catch (error) {
        return Promise.reject(
          new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
        );
      }
      return User.deleteOne({ _id: id });
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Server Error: can't delete user",
        ),
      );
    }
  };

  /**
   * get all users with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IUser[]; count: number }>} a promise of { list: IUser[]; count: number }
   * @throws 404 error
   */
  static listAllUsers = async (
    connectedUser: IUser,
    companyId: string,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IUser[];
    count: number;
  }> => {
    try {
      const usersIdsSet: string[] = [];

      const companyAdmins = await CompaniesService.listAllCompanyAdmins(
        companyId,
        limit,
        skip,
      );

      companyAdmins.list.forEach(admin =>
        usersIdsSet.push(admin._id.toString()),
      );

      const allUsers: IUser[] = await User.find({}).populate({
        path: 'roles',
        select: '-password',
        populate: { path: 'company' },
      });

      const allCompanyUser: IUser[] = companyAdmins.list;

      allUsers.forEach(user => {
        user.roles.forEach(role => {
          if (
            role.company._id.toString() === companyId.toString() &&
            !usersIdsSet.includes(user._id.toString())
          ) {
            usersIdsSet.push(user._id.toString());
            allCompanyUser.push(user);
          }
        });
      });

      return {
        list: allCompanyUser,
        count: allCompanyUser.length,
      };
    } catch (error) {
      console.log(error);
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'Users not found'),
      );
    }
  };

  /**
   * find user by email
   * @static
   * @since 1.0.0
   * @param {string} email the user email to be checked
   * @return {Promise<IUser | null>} promise of IUser or null
   * @throws 404 error
   */
  static findUserByEmail = async (email: string): Promise<IUser> => {
    try {
      const user = await User.findOne({ email });

      if (!user) throw 'Error';

      return user;
    } catch (error) {
      console.log('ERROOOOR HERE ===> ', error);
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    }
  };

  /**
   * find user by email and user id
   * @static
   * @since 1.0.0
   * @param {string} email the user email to be checked
   * @return {Promise<IUser | null>} promise of IUser or null
   * @throws 404 error
   */
  static findUserByEmailAndUserId = async (
    email: string,
    id: string,
  ): Promise<IUser | null> => {
    try {
      return User.findOne({ email, _id: id });
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'User not found'),
      );
    }
  };

  /**
   * hash password using bcrypt
   * @static
   * @since 1.0.0
   * @param {string} password the password
   * @return {string} the hashed password
   */
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, keys.SALT);
  }

  /**
   * check validation of a hashed password
   * @static
   * @since 1.0.0
   * @param {boolean} unencryptedPassword the hashed password
   * @param {boolean} password the password
   * @return {boolean} a boolean for valid or not valid password checking
   */
  static checkIfUnencryptedPasswordIsValid(
    unencryptedPassword: string,
    password: string,
  ): boolean {
    return bcrypt.compareSync(unencryptedPassword, password);
  }

  /**
   * get users count by role id
   * @static
   * @since 1.0.0
   * @param {uuid} id role id must be a valid uuid
   * @return {Promise<number>} a promise of number
   * @TODO add rquest
   */
  static getUsersCountUsingRole = async (roleId: string): Promise<number> => {
    const role: IRole = new Role();
    // eslint-disable-next-line no-underscore-dangle
    role._id = roleId;
    // User.find({ 'role.permissions': { $elemMatch: {_id: permissionId} } }).countDocuments();
    User.countDocuments({ roles: role });
    return 0;
  };

  static CheckIfUsersInSameCompany = async (
    connectedUser: IUser,
    userId: string,
  ): Promise<boolean> => {
    const connectedUserCompanies = (
      await CompaniesService.getUserCompanies(connectedUser)
    ).list;

    const userCompanies = (await CompaniesService.getUserCompanies(userId))
      .list;

    let auth = false;

    const connectedUserCompaniesIdSet: string[] = connectedUserCompanies.map(
      company => company._id.toString(),
    );

    userCompanies.forEach(company => {
      if (connectedUserCompaniesIdSet.includes(company._id.toString()))
        auth = true;
    });

    if (!auth)
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new user",
        ),
      );

    return true;
  };
}
