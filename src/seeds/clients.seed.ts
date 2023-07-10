import clients from './data/clients.data';
import ClientsService from '../features/clients/clients.service';
import { ClientDTO } from '../features/clients';

const seedClients = async (): Promise<void> => {
  try {
    const clientsData: ClientDTO[] = await clients();
    // eslint-disable-next-line no-restricted-syntax
    for (const client of clientsData) {
      // eslint-disable-next-line no-await-in-loop
      await ClientsService.createClient(client);
    }
  } catch (error) {
    console.log('%c⧭', 'color: #7f7700', `Error clients seeds ${error}`);
  }
};

export default seedClients;
