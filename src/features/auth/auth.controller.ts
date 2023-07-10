import { Request, Response, Router } from 'express';
import { Controller, HttpStatusEnum } from '../../shared';
import AuthService from './auth.service';
import LoginDTO from './dtos/login.dto';
import validationMiddleware from '../../middlewares/dataValidator';
import UpdatePasswordDTO from './dtos/updatePassword.dto';
import ResetPasswordDTO from './dtos/resetPassword.dto';
import { OAuth } from '../../middlewares/OAuth';
import { IUser, UsersService } from '../users';
import CompanyRegisterDTO from './dtos/company.register.dto';
import { getRolePermissions } from '../roles/resources/default_roles';
import { CompaniesService, Company, ICompany } from '../companies';
import { IRole, Role } from '../roles';

class AuthController implements Controller {
  path = '/auth';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.post('/login', validationMiddleware(LoginDTO), this.login);
    this.route.post(
      '/company/register',
      validationMiddleware(CompanyRegisterDTO),
      this.companyRegister,
    );
    this.route.post(
      '/updatePass',
      OAuth,
      validationMiddleware(UpdatePasswordDTO),
      this.updatePassword,
    );
    this.route.get('/:email', this.generatePasswordResetToken);
    this.route.get(
      '/reset/:token',
      validationMiddleware(ResetPasswordDTO),
      this.resetPassword,
    );
  }

  async login(req: Request, res: Response): Promise<void> {
    const loginDTO: LoginDTO = req.body;
    const token: string = await AuthService.login(loginDTO);
    res.status(HttpStatusEnum.SUCCESS).send({ token });
  }

  async companyRegister(req: Request, res: Response): Promise<void> {
    try {
      const companyRegisterDTO: CompanyRegisterDTO = req.body;

      const companyAdminPermissions = getRolePermissions('company admin');

      const companyAdminRole: IRole = await Role.create({
        name: companyRegisterDTO.name.concat(' admin'),
        isActivated: true,
        company: new Company(),
        permissions: companyAdminPermissions,
      });

      const user: IUser = await UsersService.createUser({
        ...companyRegisterDTO.admin,
        roles: [companyAdminRole.name],
      });

      const company: ICompany = await CompaniesService.createCompany(
        { ...companyRegisterDTO, admins: [user._id] },
        user,
      );

      companyAdminRole.company = company;

      await Role.findByIdAndUpdate(companyAdminRole._id, companyAdminRole);

      const nestedCompany: ICompany | null = await CompaniesService.getCompany(
        company._id,
      );

      res.status(HttpStatusEnum.SUCCESS).send(
        nestedCompany || {
          status: HttpStatusEnum.BAD_REQUEST,
          message: 'An Error occurred while Company registration',
        },
      );
    } catch {
      res.status(HttpStatusEnum.BAD_REQUEST).send({
        status: HttpStatusEnum.BAD_REQUEST,
        message:
          'An Error occurred while Company registration, Company or user already exists',
      });
    }
  }

  async updatePassword(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const newPassword: UpdatePasswordDTO = req.body;

    const updatingPassword = await AuthService.updatePassword(
      connectedUser,
      newPassword,
    );
    res
      .status(HttpStatusEnum.SUCCESS)
      .send({ status: HttpStatusEnum.SUCCESS, message: updatingPassword });
  }

  async generatePasswordResetToken(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const message = await AuthService.generatePasswordResetToken(email);
    res
      .status(HttpStatusEnum.SUCCESS)
      .send({ status: HttpStatusEnum.SUCCESS, message });
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    const { token } = req.params;
    const newPassword: ResetPasswordDTO = req.body;
    const resetPassword = await AuthService.resetPassword(token, newPassword);
    res
      .status(HttpStatusEnum.SUCCESS)
      .send({ status: HttpStatusEnum.SUCCESS, message: resetPassword });
  }
}

export default AuthController;
