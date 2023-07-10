import users from './data/users.data';
import UsersService from '../features/users/users.service';
import { IUser, User, UserDTO } from '../features/users';
import { IRole, Role, RolesService } from '../features/roles';
import { Company } from '../features/companies';

const seedUsers = async (): Promise<void> => {
  try {
    const usersData: UserDTO[] = await users();
    let i = 0;
    const companies = await Company.find();
    // eslint-disable-next-line no-restricted-syntax
    for (const userDTO of usersData) {
      // eslint-disable-next-line no-await-in-loop
      const user: IUser = new User();
      user.firstName = userDTO.firstName;
      user.lastName = userDTO.lastName;
      user.email = userDTO.email;
      user.isActivated = userDTO.isActivated;
      user.password = UsersService.hashPassword(userDTO.password);
      user.profilePicture = userDTO.profilePicture;
      // eslint-disable-next-line no-await-in-loop
      const role: IRole | null = await Role.findOne({
        name: userDTO.roles ? userDTO.roles[0] : '',
      });
      // eslint-disable-next-line no-continue
      if (!role) continue;
      role.company = companies[i % (companies.length - 1)];
      // eslint-disable-next-line no-await-in-loop
      const userRoleInCompany = await RolesService.createRole({
        companyId: role.company._id,
        name: role.name,
        permissions: role.permissions,
        isActivated: true,
      });
      user.roles = [userRoleInCompany];
      // should be created by an admin or by him self (signup)
      // if signup createBy will be undefined that will make the difference

      // eslint-disable-next-line no-await-in-loop
      await User.create(user);
      i += 1;
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error users seeds ${error}`);
  }
};

export default seedUsers;
