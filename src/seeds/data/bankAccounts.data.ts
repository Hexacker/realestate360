import * as faker from 'faker';
import { BankAccountDTO } from '../../features/bankAccounts';
import { Company, ICompany } from '../../features/companies';

const bankAccounts = async (): Promise<BankAccountDTO[]> => {
  const bankAccountsData: BankAccountDTO[] = [];
  const companies: ICompany[] = await Company.find();
  let i: number;
  i = 1;
  // let roles: Role[] = await Role.find();
  // eslint-disable-next-line no-plusplus
  const banks = ['Bank of', 'Bank'];
  const typeAccounts = ['current', 'savings', 'recurring', 'fixed'];
  for (i; i <= 10; i += 1) {
    const bankAccount: BankAccountDTO = new BankAccountDTO();
    // bankAccount.roles = roles.filter((role, index) => index > i % (roles.length));

    bankAccount.isActivated = true;
    const company = companies[i % companies.length];
    // eslint-disable-next-line no-underscore-dangle
    bankAccount.companyId = company._id;
    bankAccount.name = `Account for ${company.name}`;
    bankAccount.bankName = `${
      i % 2 ? banks[0] : ''
    } ${faker.company.companyName()} ${!(i % 2) ? banks[1] : ''}`.trim();
    bankAccount.typeAccount =
      typeAccounts[faker.random.number(typeAccounts.length - 1)];
    bankAccountsData.push(bankAccount);
  }
  return bankAccountsData;
};
export default bankAccounts;
