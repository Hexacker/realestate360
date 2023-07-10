import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import QuotesService from './quotes.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { QuoteDTO } from '.';

import { IUser } from '../users';
import { ProductsService } from '../products';
import { ProjectsService } from '../projects';
import { CompaniesService } from '../companies';
import { SalesService } from '../sales';

class QuotesController implements Controller {
  path = '/quotes';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllQuotes);
    this.route.get('/:id', this.getQuote);
    this.route.get('/product/:id', this.getProductQuote);
    this.route.get('/sale/:id', this.getSalesQuote);
    this.route.post('/', [validationMiddleware(QuoteDTO)], this.createQuote);
    this.route.put('/:id', [validationMiddleware(QuoteDTO)], this.updateQuote);
    this.route.delete('/:id', this.deleteQuote);
  }

  async getQuote(req: Request, res: Response): Promise<void> {
    const quote = await QuotesService.getQuote(req.params.id);

    const product = await ProductsService.getProduct(quote.product._id);

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(quote);
  }

  async getProductQuote(req: Request, res: Response): Promise<void> {
    const { id: productId } = req.params;

    const product = await ProductsService.getProduct(productId);

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const productQuotes = await QuotesService.getProductQuotes(product);

    res.status(HttpStatusEnum.SUCCESS).send({
      list: productQuotes,
      count: productQuotes.length,
    });
  }

  async getSalesQuote(req: Request, res: Response): Promise<void> {
    const { id: saleId } = req.params;

    const sale = await SalesService.getSale(saleId);

    const product = await ProductsService.getProduct(
      sale.product._id.toString(),
    );

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const productQuotes = await QuotesService.getProductQuotes(product);

    res.status(HttpStatusEnum.SUCCESS).send({
      list: productQuotes,
      count: productQuotes.length,
    });
  }

  async getAllQuotes(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const { id: companyId } = req.params;
    const company = await CompaniesService.getCompany(companyId);

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const quotes = await QuotesService.listAllQuotes(
      connectedUser,
      company,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(quotes);
  }

  async createQuote(req: Request, res: Response): Promise<void> {
    const quoteDto: QuoteDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const product = await ProductsService.getProduct(quoteDto.productId);

    const project = await ProjectsService.getProject(product.group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const quote = await QuotesService.createQuote(quoteDto, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(quote);
  }

  async updateQuote(req: Request, res: Response): Promise<void> {
    const quoteDto: QuoteDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const quote = await QuotesService.getQuote(req.params.id);

    let product = await ProductsService.getProduct(quote.product._id);

    let project = await ProjectsService.getProject(product.group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    product = await ProductsService.getProduct(quoteDto.productId);

    project = await ProjectsService.getProject(product.group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const updatedQuote = await QuotesService.updateQuote(
      id,
      quoteDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedQuote);
  }

  async deleteQuote(req: Request, res: Response): Promise<void> {
    const quote = await QuotesService.getQuote(req.params.id);

    const product = await ProductsService.getProduct(quote.product._id);

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const deleted = await QuotesService.deleteQuote(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default QuotesController;
