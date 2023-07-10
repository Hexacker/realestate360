import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import ProductGroupDTO from './dto/productGroup.dto';
import ProductGroupsService from './productGroups.service';
import { IUser } from '../users';
import { CompaniesService } from '../companies';
import { ProjectsService } from '../projects';

class ProductGroupsController implements Controller {
  path = '/product-groups';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getCompanyProductGroup);
    this.route.get('/:id', this.getProductGroup);
    this.route.get('/products/:id', this.getProductGroupProducts);
    this.route.get('/project/:id', this.getProjectProductGroup);
    this.route.get('/', this.getAllProductsGroups);
    this.route.post(
      '/',
      validationMiddleware(ProductGroupDTO),
      this.createProduct,
    );
    this.route.put(
      '/:id',
      validationMiddleware(ProductGroupDTO),
      this.updateProduct,
    );
    this.route.delete('/:id', this.deleteProduct);
  }

  async getProductGroup(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const productGroup = await ProductGroupsService.getProductGroup(
      req.params.id,
    );

    await CompaniesService.hasPermissionOn(
      productGroup.project.company._id,
      connectedUser._id,
    );

    res.status(HttpStatusEnum.SUCCESS).send(productGroup);
  }

  async getProductGroupProducts(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const productGroup = await ProductGroupsService.getProductGroup(
      req.params.id,
    );

    await CompaniesService.hasPermissionOn(
      productGroup.project.company._id,
      connectedUser._id,
    );

    const productsGroupProducts = await ProductGroupsService.getProducts(
      productGroup,
    );

    res.status(HttpStatusEnum.SUCCESS).send({
      list: productsGroupProducts,
      count: productsGroupProducts.length,
    });
  }

  async getCompanyProductGroup(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const { id: companyId } = req.params;

    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const company = await CompaniesService.getCompany(companyId);

    const productsGroupProducts = await ProductGroupsService.getCompanyProductGroup(
      company,
    );

    res.status(HttpStatusEnum.SUCCESS).send({
      list: productsGroupProducts,
      count: productsGroupProducts.length,
    });
  }

  async getProjectProductGroup(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const { id: projectId } = req.params;

    const project = await ProjectsService.getProject(projectId);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const productsGroupProducts = await ProductGroupsService.getProjectProductGroup(
      project,
    );

    res.status(HttpStatusEnum.SUCCESS).send({
      list: productsGroupProducts,
      count: productsGroupProducts.length,
    });
  }

  async getAllProductsGroups(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;
    const products = await ProductGroupsService.listAllProductsGroups(
      connectedUser,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(products);
  }

  async createProduct(req: Request, res: Response): Promise<void> {
    const productGroupDTO: ProductGroupDTO = req.body;
    const connectedUser: IUser = (req as any).iUser;

    const project = await ProjectsService.getProject(productGroupDTO.projectId);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const product = await ProductGroupsService.createGroupProduct(
      productGroupDTO,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(product);
  }

  async updateProduct(req: Request, res: Response): Promise<void> {
    const productGroupDTO: ProductGroupDTO = req.body;
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    let project = await ProjectsService.getProject(productGroupDTO.projectId);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const group = await ProductGroupsService.getProductGroup(req.params.id);

    project = await ProjectsService.getProject(group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const updatedProduct = await ProductGroupsService.updateGroupProduct(
      id,
      productGroupDTO,
      connectedUser,
    );
    res.status(HttpStatusEnum.SUCCESS).send(updatedProduct);
  }

  async deleteProduct(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const group = await ProductGroupsService.getProductGroup(req.params.id);

    const project = await ProjectsService.getProject(group.project._id);

    await CompaniesService.hasPermissionOn(
      project.company._id,
      connectedUser._id,
    );

    const product = await ProductGroupsService.deleteProductGroup(
      req.params.id,
    );
    res.status(HttpStatusEnum.SUCCESS).send(product);
  }
}

export default ProductGroupsController;
