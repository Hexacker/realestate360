import connectDB, { disconnectDB } from '../../../config/db/database';
import { CompaniesService, Company } from '../../companies';
import { BankAccount, BankAccountsService } from '..';

import { useSeeds } from '../../../seeds/init';
import { IUser, User, UsersService } from '../../users';

describe('Bank Account services features tests', () => {
  let cnxdb: any;

  let bnkAccount: any;
  let company: any;

  let iUser: any;
  const userDTO = {
    firstName: 'test',
    lastName: 'user',
    email: 'test@gmail.com',
    password: 'password',
    profilePicture: 'null',
    isActivated: true,
    roles: ['SUPER_ADMIN'],
  };

  const companyDTO = {
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
  const bnkAccountDTO = {
    name: 'name',
    bankName: 'bank name',
    typeAccount: 'current',
    isActivated: true,
    companyId: 'null',
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

    // update bank account DTO
    bnkAccountDTO.companyId = company._id;

    // create bank account
    bnkAccount = await BankAccountsService.createBankAccount(bnkAccountDTO);
  });

  afterAll(async done => {
    // close the connection to db
    await disconnectDB();
    done();
  });

  it('should be well connected to db', () => {
    expect(cnxdb).not.toBeNull();
  });

  it('bank account should be created', async () => {
    expect(bnkAccount).not.toBeNull();
  });

  it('get bank account by id', async () => {
    try {
      const bank = await BankAccountsService.getBankAccount(bnkAccount._id);
      expect(bank).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('update bank account', async () => {
    try {
      const bnk = await BankAccountsService.updateBankAccount(
        bnkAccount._id,
        bnkAccountDTO,
      );
      expect(bnk).not.toBeNull();
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('list all bank accounts', async () => {
    try {
      const bnks = await BankAccount.find();
      expect(bnks.length).not.toEqual(0);
    } catch (err) {
      expect(err).toBeNull();
    }
  });

  it('delete bank account', async () => {
    try {
      const bnkDeleted = await BankAccountsService.deleteBankAccount(
        bnkAccount._id,
      );
      expect(bnkDeleted.deletedCount).toEqual(1);
    } catch (err) {
      expect(err).toBeNull();
    }
  });
});
