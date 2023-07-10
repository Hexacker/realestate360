import * as faker from 'faker';
// import { IRole, Role } from '../../features/roles';
import { UserDTO } from '../../features/users';

const users = async (): Promise<UserDTO[]> => {
  const usersData: UserDTO[] = [];
  // const roles: IRole[] = await Role.find();
  // let i: number;
  // i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus

  let user: UserDTO = new UserDTO();
  // user.roles = roles.filter((role, index) => index > i % (roles.length));
  user.isActivated = true;
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = 'admin@gmail.com';
  user.password = 'admin';
  // eslint-disable-next-line no-multi-assign
  user.profilePicture = faker.image.avatar();
  user.roles = ['company admin'];
  usersData.push(user);

  user = new UserDTO();
  // user.roles = roles.filter((role, index) => index > i % (roles.length));
  user.isActivated = true;
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = 'company.admin@gmail.com';
  user.password = 'admin';
  // eslint-disable-next-line no-multi-assign
  user.profilePicture = faker.image.avatar();
  user.roles = ['company admin'];
  usersData.push(user);

  user = new UserDTO();
  // user.roles = roles.filter((role, index) => index > i % (roles.length));
  user.isActivated = true;
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = 'project.admin@gmail.com';
  user.password = 'admin';
  // eslint-disable-next-line no-multi-assign
  user.profilePicture = faker.image.avatar();
  user.roles = ['project admin'];
  usersData.push(user);

  user = new UserDTO();
  // user.roles = roles.filter((role, index) => index > i % (roles.length));
  user.isActivated = true;
  user.firstName = faker.name.firstName();
  user.lastName = faker.name.lastName();
  user.email = 'basic@gmail.com';
  user.password = 'admin';
  // eslint-disable-next-line no-multi-assign
  user.profilePicture = faker.image.avatar();
  user.roles = ['basic'];
  usersData.push(user);

  return usersData;
};
export default users;
