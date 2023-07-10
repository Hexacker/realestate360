import Country from './country.model';
import ICountry from './country.interface';
import CountryDTO from './dto/country.dto';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import UpdatedDocument from '../../helpers/update.interface';
import DeleteFromDatabase from '../../helpers/delete.interface';
import { Project } from '../projects';
import { IUser } from '../users';

export default class CountriesService {
  /**
   * get country by id
   * @static
   * @since 1.0.0
   * @param {uuid} id country id must be a valid uuid
   * @return {Promise<ICountry | null>} a promise of ICountry or null
   */
  static getCountry = async (id: string): Promise<ICountry | null> => {
    try {
      const country = await Country.findById(id)
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });

      if (!country) throw 'Error';

      return country;
    } catch {
      return Promise.reject(
        new HttpException(HttpStatusEnum.NOT_FOUND, 'country not found'),
      );
    }
  };

  /**
   * get all Countries with optionnal pagination
   * @static
   * @since 1.0.0
   * @param {number} take take pagination param @optionnal
   * @param {number} skip skip pagination param @optionnal
   * @return {Promise<{ list: ICountry[]; count: number }>} a promise of { list: ICountry[]; count: number }
   * @throws 404 error
   */
  static listAllCountries = async (
    limit?: number,
    skip?: number,
  ): Promise<{
    list: ICountry[];
    count: number;
  }> => {
    const count: number = await Country.countDocuments();
    let countries: ICountry[] = [];
    try {
      const query = Country.find()
        .populate({
          path: 'lastUpdatedBy',
          select: '-password -roles',
        })
        .populate({
          path: 'createdBy',
          select: '-password -roles',
        });
      if (limit !== undefined && skip !== undefined) {
        countries = await query.limit(limit).skip(skip);
      } else {
        countries = await query;
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.SERVER_ERROR, 'unkown error'),
      );
    }

    const result = {
      list: countries,
      count,
    };

    return result;
  };

  /**
   * create a new country
   * @static
   * @since 1.0.0
   * @param {CountryDTO} CountryDTO the country DTO object
   * @return {Promise<ICountry>}  a promise of ICountry
   * @throws 400 error, Can't create the new client
   */
  static createCountry = async (
    countryDTO: CountryDTO,
    connectedUser?: IUser,
  ): Promise<ICountry> => {
    try {
      const country: ICountry = new Country();

      const { code, name, isActivated = true } = countryDTO;

      country.name = name;
      country.code = code;
      country.isActivated = isActivated;
      country.createdBy = connectedUser;
      return Country.create(country);
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Can't create the new country",
        ),
      );
    }
  };

  /**
   * update country
   * @static
   * @since 1.0.0
   * @param {CountryDTO} CountryDTO the country DTO object
   * @return {Promise<UpdatedDocument>} a promise of UpdatedDocument
   * @throws 404 error, Client not found message
   */
  static updateCountry = async (
    id: string,
    countryDTO: CountryDTO,
    connectedUser?: IUser,
  ): Promise<any> => {
    try {
      const country: ICountry | null = await Country.findById(id);

      if (!country)
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'Country not found !'),
        );
      const { code, name, isActivated = true } = countryDTO;

      country.name = name;
      country.code = code;
      country.isActivated = isActivated;
      country.lastUpdatedBy = connectedUser;

      let updated: any;

      updated = await Country.findOneAndUpdate({ _id: id }, country);

      if (!updated) throw 'Error';

      updated = await CountriesService.getCountry(id);

      if (!updated) throw 'Error';

      return updated;
    } catch (error) {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          "Country Can't be updated",
        ),
      );
    }
  };

  /**
   * delete country
   * @static
   * @since 1.0.0
   * @param {uuid} id Country id must be a valid uuid
   * @return {Promise<DeleteFromDatabase>} a promise of DeleteFromDatabase
   * @throws 404 error, country not found message
   * @throws 403 error, can't remove this country that's used with other entities
   */
  static deleteCountry = async (id: string): Promise<DeleteFromDatabase> => {
    try {
      const country: ICountry | null = await Country.findById(id);

      if (country) {
        const atLeastOneProject = Project.findOne({ country });

        if (atLeastOneProject) {
          throw new Error(
            `can't remove this Country that's used with other entities`,
          );
        }
      } else {
        return Promise.reject(
          new HttpException(HttpStatusEnum.NOT_FOUND, 'Country not exist'),
        );
      }
    } catch (error) {
      return Promise.reject(
        new HttpException(HttpStatusEnum.FORBIDDEN, error.toString()),
      );
    }
    return Country.deleteOne({ _id: id });
  };
}
