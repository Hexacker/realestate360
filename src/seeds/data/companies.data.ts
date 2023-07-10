import * as faker from 'faker';
import { CompanyDTO } from '../../features/companies';
import { IUser, User } from '../../features/users';

const companies = async (): Promise<CompanyDTO[]> => {
  const companiesData: CompanyDTO[] = [];
  const users: IUser[] = await User.find();
  let i: number;
  i = 0;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  for (i; i < 9; i++) {
    const company: CompanyDTO = new CompanyDTO();
    company.isActivated = true;
    company.name = faker.company.companyName();
    company.phone = faker.phone.phoneNumber();
    company.city = faker.address.city();
    company.state = faker.address.state();
    company.address = faker.address.streetAddress();
    company.numEmployees = faker.random.number(10000);
    company.logoUrl = faker.image.business();
    company.admins = [];
    // eslint-disable-next-line no-unused-expressions
    users.length > 0 && i < users.length && company.admins.push(users[i]._id);

    // company.admins = [];
    companiesData.push(company);
  }
  return companiesData;
};
export default companies;
