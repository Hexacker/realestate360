import * as faker from 'faker';
import { ICompany, Company } from '../../features/companies';
import { ClientDTO } from '../../features/clients';

const clients = async (): Promise<ClientDTO[]> => {
  const clientsData: ClientDTO[] = [];
  const companies: ICompany[] = await Company.find();
  let i: number;
  i = 1;
  // eslint-disable-next-line no-plusplus
  for (i; i <= 10; i++) {
    const client: ClientDTO = new ClientDTO();
    client.name = faker.name.firstName();
    client.email = faker.internet.email(client.name).toLowerCase();
    client.phone = faker.phone.phoneNumber();
    client.address = faker.address.streetAddress();
    client.isActivated = true;
    client.source = faker.random.words(20);
    client.companyId = companies[i % companies.length]._id;
    clientsData.push(client);
  }
  return clientsData;
};
export default clients;
