import bankAccounts from './data/bankAccounts.data';
import bankAccountsService from '../features/bankAccounts/bankAccounts.service';
import { BankAccountDTO } from '../features/bankAccounts';

const seedBankAccounts = async (): Promise<void> => {
  try {
    const bankAccountsData: BankAccountDTO[] = await bankAccounts();
    // console.log('%c⧭', 'color: #cc0088', bankAccountsData);
    // eslint-disable-next-line no-restricted-syntax
    for (const bankAccount of bankAccountsData) {
      // eslint-disable-next-line no-await-in-loop
      await bankAccountsService.createBankAccount(bankAccount);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error bank accounts seeds ${error}`);
  }
};

export default seedBankAccounts;
