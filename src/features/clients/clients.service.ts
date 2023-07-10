/* eslint-disable no-unused-expressions */
import IClient from './client.interface';
import { CompaniesService, Company, ICompany } from '../companies';
import ClientDTO from './dto/client.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { Sale } from '../sales';
import { Payment } from '../payments';
import { Client } from '.';
import { IUser } from '../users';

export default class ClientsService {
  /**
   * get client by id
   * @static
   * @since 1.0.0
   * @param {uuid} id client id must be a valid uuid
   * @return {Promise<IClient | null>} a promise of IClient or null
   */
  static getClient = async (id: string): Promise<IClient> => {
    try {
      const client = await Client.findById(id)
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!client) throw 'Error';

      return client;
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'client not found'),
      );
    }
  };

  /**
   * get all clientss with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IClient[]; count: number }>} a promise of { list: IClient[]; count: number }
   * @throws 404 error
   */
  static listAllClients = async (
    connectedUser: IUser,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IClient[];
    count: number;
  }> => {
    const { list } = await CompaniesService.getUserCompanies(connectedUser._id);

    const usercompany: ICompany | null = list.length > 0 ? list[0] : null;

    if (!usercompany) throw 'Error';

    const count: number = await Client.countDocuments({ company: usercompany });
    let accounts: IClient[] = [];
    try {
      const query = Client.find({ company: usercompany })
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });
      if (limit !== undefined && skip !== undefined) {
        accounts = await query.limit(limit).skip(skip);
      } else {
        accounts = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error: cant get clients',
        ),
      );
    }

    const result = {
      list: accounts,
      count,
    };
    return result;
  };

  /**
   * get all company clients with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: IClient[]; count: number }>} a promise of { list: IClient[]; count: number }
   * @throws 404 error
   */
  static listAllClientsByCompany = async (
    companyId: string,
    limit?: number,
    skip?: number,
  ): Promise<{
    list: IClient[];
    count: number;
  }> => {
    const company = await Company.findById(companyId);

    if (!company) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, 'Company not found'),
      );
    }

    const count: number = await Client.countDocuments({ company });
    let accounts: IClient[] = [];
    try {
      const query = Client.find({ company })
        .populate({
          path: 'company',
          select: '-admins',
        })
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });
      if (limit !== undefined && skip !== undefined) {
        accounts = await query.limit(limit).skip(skip);
      } else {
        accounts = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'Error: cant get clients',
        ),
      );
    }

    const result = {
      list: accounts,
      count,
    };
    return result;
  };

  /**
   * create a new client
   * @static
   * @since 1.0.0
   * @param {ClientDTO} ClientDTO the Client DTO object
   * @return {Promise<IClient>}  a promise of IClient
   * @throws 400 error, Can't create the new client
   */
  static createClient = async (
    clientDTO: ClientDTO,
    connectedUser?: IUser,
  ): Promise<IClient> => {
    try {
      const client: IClient = new Client();

      const {
        name,
        email,
        phone,
        address,
        source,
        companyId,
        isActivated,
      } = clientDTO;

      const company = await CompaniesService.getCompany(companyId);

      if (!company)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Company ID'),
        );

      client.name = name;
      client.email = email;
      client.phone = phone;
      client.address = address;
      client.source = source;
      client.isActivated = isActivated;
      client.company = company;

      client.createdBy = connectedUser;

      return Client.create(client);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new client",
        ),
      );
    }
  };

  /**
   * update Client
   * @static
   * @since 1.0.0
   * @param {ClientDTO} ClientDTO the Client DTO object
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, Client not found message
   */
  static updateClient = async (
    id: string,
    clientDTO: ClientDTO,
    connectedUser?: IUser,
  ): Promise<IClient> => {
    try {
      const client: IClient | null = await ClientsService.getClient(id);

      if (!client)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Client not found !'),
        );

      const {
        name,
        email,
        phone,
        address,
        source,
        companyId,
        isActivated,
      } = clientDTO;

      const company = await CompaniesService.getCompany(companyId);

      if (!company)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Company ID'),
        );

      client.name = name;
      client.email = email;
      client.phone = phone;
      client.address = address;
      client.source = source;
      client.isActivated = isActivated;

      client.company = company;

      client.lastUpdatedBy = connectedUser;

      let updated: any;

      updated = await Client.findByIdAndUpdate({ _id: id }, client);

      if (!updated) throw 'Error';

      updated = await ClientsService.getClient(id);

      if (!updated) throw 'Error';

      return updated;
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Client Can't be updated",
        ),
      );
    }
  };

  /**
   * delete client
   * @static
   * @since 1.0.0
   * @param {uuid} id client id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, client not found message
   * @throws 403 error, can't remove this client that's used with other entities
   */
  static deleteClient = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      try {
        const client: IClient | null = await Client.findById(id);
        if (client) {
          const atLeastOneSale = Sale.findOne({ client });
          const atLeastOnePayment = Payment.findOne({ client });

          if (atLeastOneSale || atLeastOnePayment) {
            throw new Error(
              `can't remove this client that's used with other entities`,
            );
          }
        } else {
          return Promise.reject(
            new HttpException(HttpStatusEnum.NOT_FOUND, 'client not exist'),
          );
        }
      } catch (error) {
        return Promise.reject(
          new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
        );
      }
      return Client.deleteOne({ _id: id });
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          "Server Error: can't delete client",
        ),
      );
    }
  };

  /**
   * get clients count by company id
   * @static
   * @since 1.0.0
   * @param {uuid} id company id must be a valid uuid
   * @return {Promise<number>} a promise of number
   */
  static getClientsCountByCompany = async (
    companyId: string,
  ): Promise<number> => {
    // eslint-disable-next-line no-undef
    const company: ICompany = new Company();
    // eslint-disable-next-line no-underscore-dangle
    company._id = companyId;
    return Client.countDocuments({ company });
  };

  static hasPermissionOn = async (
    clientId: string,
    connectedUser: IUser,
  ): Promise<boolean> => {
    const client = await ClientsService.getClient(clientId);

    return CompaniesService.hasPermissionOn(
      client.company._id,
      connectedUser._id,
    );
  };
}
