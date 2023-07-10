import { CountriesService, CountryDTO } from '../features/countries';
import countries from './data/countries.data';

const seedCountries = async (): Promise<void> => {
  try {
    const countriesData: CountryDTO[] = await countries();
    // eslint-disable-next-line no-restricted-syntax
    for (const country of countriesData) {
      // eslint-disable-next-line no-await-in-loop
      await CountriesService.createCountry(country);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error seed countries ${error}`);
  }
};

export default seedCountries;
