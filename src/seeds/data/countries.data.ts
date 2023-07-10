import { CountryDTO } from '../../features/countries';

const countries = async (): Promise<CountryDTO[]> => {
  const countriesData: CountryDTO[] = [];
  const countriesRaw = [
    {
      name: 'Algeria',
      code: {
        alpha2: 'DZ',
        alpha3: 'DZA',
      },
    },
    {
      name: 'United states of America',
      code: {
        alpha2: 'US',
        alpha3: 'USA',
      },
    },
    {
      name: 'Canada',
      code: {
        alpha2: 'CA',
        alpha3: 'CAN',
      },
    },
    {
      name: 'Mexico',
      code: {
        alpha2: 'MX',
        alpha3: 'MEX',
      },
    },
  ];
  // eslint-disable-next-line no-restricted-syntax
  for (const countryRaw of countriesRaw) {
    const country: CountryDTO = new CountryDTO();
    country.isActivated = true;
    country.name = countryRaw.name;
    country.code = countryRaw.code;
    countriesData.push(country);
  }
  return countriesData;
};
export default countries;
