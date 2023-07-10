import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import ProductsService from './products.service';
import validationMiddleware from '../../middlewares/dataValidator';
import { ProductDTO } from '.';

import { IUser } from '../users';
import { ProjectsService } from '../projects';
import { CompaniesService } from '../companies';
import { ProductGroupsService } from '../productGroups';
import { QuotesService } from '../quotes';
import { SalesService } from '../sales';

class ProductsController implements Controller {
  path = '/products';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllProducts);
    this.route.get('/:id', this.getProduct);
    this.route.post(
      '/',
      [validationMiddleware(ProductDTO)],
      this.createProduct,
    );
    this.route.put(
      '/:id',
      [validationMiddleware(ProductDTO)],
      this.updateProduct,
    );
    this.route.delete('/:id', this.deleteProduct);
  }

  async getProduct(req: Request, res: Response): Promise<void> {
    const product = await ProductsService.getProduct(req.params.id);

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const productQuotes = await QuotesService.getProductQuotes(product);

    const productSales = await SalesService.getProductSales(product);

    res.status(HttpStatusEnum.SUCCESS).send({
      product,
      productQuotes,
      productSales,
    });
  }

  async getAllProducts(req: Request, res: Response): Promise<void> {
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
    const products = await ProductsService.listAllProducts(
      connectedUser,
      company,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(products);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const productDto: ProductDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const group = await ProductGroupsService.getProductGroup(
      productDto.groupId,
    );

    const project = await ProjectsService.getProject(group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const product = await ProductsService.createProduct(
      productDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(product);
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productDto: ProductDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const group = await ProductGroupsService.getProductGroup(
      productDto.groupId,
    );

    let project = await ProjectsService.getProject(group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const product = await ProductsService.getProduct(req.params.id);

    project = await ProjectsService.getProject(product.group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const updatedProduct = await ProductsService.updateProduct(
      id,
      productDto,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedProduct);
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const product = await ProductsService.getProduct(req.params.id);

    const project = await ProjectsService.getProject(product.group.project._id);

    const connectedUser: IUser = (req as any).iUser;

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const deleted = await ProductsService.deleteProduct(req.params.id);
    res.status(HttpStatusEnum.SUCCESS).send(deleted);
  }
}

export default ProductsController;
