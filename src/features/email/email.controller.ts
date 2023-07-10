import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import EmailDTO from './email.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import EmailService from './email.service';



class EmailController implements Controller {
    path = '/mail';

    route = Router();

    constructor() {
        this.initializeRoutes();
    }

    initializeRoutes(): void {
        this.route.post('/send', validationMiddleware(EmailDTO), this.send);
    }

    async send(req: Request, res: Response): Promise<void> {
        const content: EmailDTO = req.body
        const sendMail = await EmailService.sendMail(content)
        res.status(HttpStatusEnum.SUCCESS).send(sendMail);
    }
}
export default EmailController;