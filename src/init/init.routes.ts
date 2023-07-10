import { Express } from 'express';
import { Controller } from '../shared';
import { UsersController } from '../features/users';
import { RolesController } from '../features/roles';
import { CompaniesController } from '../features/companies';
import { ProjectsController } from '../features/projects';
import { CountriesController } from '../features/countries';
import { ProjectCategoriesController } from '../features/projectCategories';
import { PaymentPlansController } from '../features/paymentPlans';
import { BankAccountsController } from '../features/bankAccounts';
import { ProductGroupsController } from '../features/productGroups';
import { ProductsController } from '../features/products';
import { QuotesController } from '../features/quotes';
import { SalesController } from '../features/sales';
import { PaymentsController } from '../features/payments';
import { ClientsController } from '../features/clients';
import { AuthController } from '../features/auth';
import { DocsController } from '../features/docs';
import { OAuth } from '../middlewares/OAuth';
import { checkRole } from '../middlewares/checkRole';

const URL_PREFIX = '/api/v1';

export default (app: Express): void => {
  const controllers: Controller[] = [
    new AuthController(),
    new UsersController(),
    new RolesController(),
    new CompaniesController(),
    new ProjectsController(),
    new CountriesController(),
    new ProjectCategoriesController(),
    new PaymentPlansController(),
    new BankAccountsController(),
    new ProductGroupsController(),
    new ProductsController(),
    new QuotesController(),
    new SalesController(),
    new PaymentsController(),
    new ClientsController(),
    new DocsController(),
  ];

  controllers.forEach(controller => {
    if (controller.path === '/auth' || controller.path === '/api-docs')
      app.use(URL_PREFIX + controller.path, controller.route);
    else
      app.use(
        URL_PREFIX + controller.path,
        [OAuth, checkRole],
        // [OAuth],
        controller.route,
      );
  });
};
