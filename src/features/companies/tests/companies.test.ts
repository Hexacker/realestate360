import connectDB, { disconnectDB } from '../../../config/db/database';
import { CompaniesService } from '..';

import { useSeeds } from '../../../seeds/init';
import { UsersService } from '../../users';

describe('Company services features tests', () => {
  let cnxdb: any;

  let company: any;

  let iUser: any;
  let userDTO = {
    firstName: 'test',
    lastName: 'user',
    email: 'test@gmail.com',
    password: 'password',
    profilePicture: 'null',
    isActivated: true,
    roles: ['SUPER_ADMIN'],
  };

  let companyDTO = {
    address: 'test',
    name: 'company name',
    state: 'test state',
    city: 'test city',
    phone: '+1 0000000000',
    logoUrl: 'null',
    numEmployees: 500,
    isActivated: true,
    admins: [''],
  };

  beforeAll(async () => {
    // establish connection
    cnxdb = await connectDB();

    // seed initial test data
    await useSeeds();

    // create user
    iUser = await UsersService.createUser(userDTO);

    // update companyDTO
    companyDTO.admins = [iUser._id];

    // create company
    company = await CompaniesService.createCompany(companyDTO);
  });

  afterAll(async done => {
    // close the connection to db
    await disconnectDB();
    done();
  });

  beforeEach(() => {});

  it('should be well connected to db', () => {
    expect(cnxdb).not.toBeNull();
  });

  it('a company should be created', async () => {
    expect(company).not.toBeNull();
  });

  it('get company by id', async () => {
    try {
      const bank = await CompaniesService.getCompany(company._id);
      expect(bank).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });
});
