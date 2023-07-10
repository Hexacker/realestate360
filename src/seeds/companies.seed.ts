import companies from './data/companies.data';
import CompaniesService from '../features/companies/companies.service';
import { CompanyDTO } from '../features/companies';

const seedCompanies = async (): Promise<void> => {
  try {
    const companiesData: CompanyDTO[] = await companies();
    // eslint-disable-next-line no-restricted-syntax
    for (const company of companiesData) {
      // eslint-disable-next-line no-await-in-loop
      await CompaniesService.createCompany(company);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error seed companies ${error}`);
  }
};

export default seedCompanies;
