import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import { IUser } from '../users';
import CountriesService from './countries.service';
import CountryDTO from './dto/country.dto';

class CountriesController implements Controller {
  path = '/countries';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/:id', this.getCountry);
    this.route.get('/', this.getAllCountries);
    this.route.post(
      '/',
      [validationMiddleware(CountryDTO)],
      this.createCountry,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(CountryDTO)],
      this.updateCountry,
    );
    this.route.delete('/:id', this.deleteCountry);
  }

  async getCountry(req: Request, res: Response): Promise<void> {
    const country = await CountriesService.getCountry(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(country);
  }

  async getAllCountries(req: Request, res: Response): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const products = await CountriesService.listAllCountries(limit, skip);
    res.status(HttpStatusEnum.SUCCESS).send(products);
  }

  async createCountry(req: Request, res: Response): Promise<void> {
    const countryDTO: CountryDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const country = await CountriesService.createCountry(
      countryDTO,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(country);
  }

  async updateCountry(req: Request, res: Response): Promise<void> {
    const countryDTO: CountryDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const newCountry = await CountriesService.updateCountry(
      id,
      countryDTO,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(newCountry);
  }

  async deleteCountry(req: Request, res: Response): Promise<void> {
    const deletedResponse = await CountriesService.deleteCountry(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deletedResponse);
  }
}

export default CountriesController;
