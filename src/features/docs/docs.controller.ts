import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { Controller } from '../../shared';
import PrivateAPI from '../../utils/swagger/docs/private_api.json';
import PublicAPI from '../../utils/swagger/docs/public_api.json';

class DocsController implements Controller {
  path = '/api-docs';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  customCss = '.swagger-ui .topbar { display: none }';

  initializeRoutes(): any {
    this.route.use(
      '/public',
      swaggerUi.serveFiles(PublicAPI, {}),
      swaggerUi.setup(PublicAPI, {
        customCss: this.customCss,
      }),
    );

    this.route.use(
      '/private',
      swaggerUi.serveFiles(PrivateAPI, {}),
      swaggerUi.setup(PrivateAPI, {
        customCss: this.customCss,
      }),
    );
  }
}

export default DocsController;
