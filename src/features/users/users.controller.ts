/* eslint-disable no-await-in-loop */
import { Request, Response, Router } from 'express';
import validationMiddleware from '../../middlewares/dataValidator';
import { Controller, HttpStatusEnum } from '../../shared';
import UserDTO from './dto/user.dto';
import UsersService from './users.service';

import { IUser } from '.';
import UpdateUserDTO from './dto/updateUser.dto';
import { CompaniesService } from '../companies';
import HttpException from '../../exceptions/httpException';
import { IRole, Role } from '../roles';

/* eslint-disable import/no-unresolved */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const multer = require('multer');

const uploader = multer({ dest: 'uploads/' });

class UsersController implements Controller {
  path = '/users';

  route = Router();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes(): void {
    this.route.get('/company/:id', this.getAllUsers);
    this.route.get('/:id', this.getUser);
    this.route.get('/find/:email', this.findUser);
    this.route.post(
      '/signup',
      [uploader.single('profilePicture'), validationMiddleware(UserDTO)],
      this.createUser,
    );
    this.route.put(
      '/:id',
      [uploader.single('profilePicture'), validationMiddleware(UpdateUserDTO)],
      this.updateUser,
    );
    this.route.delete('/:id', this.deleteUser);
  }

  async getUser(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;

    const user = await UsersService.getUser(req.params.id);

    // eslint-disable-next-line no-underscore-dangle
    await UsersService.CheckIfUsersInSameCompany(connectedUser, user._id);

    res.status(HttpStatusEnum.SUCCESS).send(user);
  }

  async findUser(req: Request, res: Response): Promise<void> {
    const { email } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    const user = await UsersService.findUserByEmail(email);

    // eslint-disable-next-line no-underscore-dangle
    await UsersService.CheckIfUsersInSameCompany(connectedUser, user._id);

    res.status(HttpStatusEnum.SUCCESS).send(user);
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const userInfo: UserDTO = req.body;

    // assigne the uploaded file to profilePicture
    userInfo.profilePicture = req.file;

    const connectedUser: IUser = (req as any).iUser;

    const userRoles: IRole[] = await Role.find({
      name: { $in: userInfo.roles },
    }).populate({
      path: 'company',
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const role of userRoles) {
      await CompaniesService.hasPermissionOn(
        // eslint-disable-next-line no-underscore-dangle
        role.company._id,
        connectedUser._id,
      );
    }

    const addUser = await UsersService.createUser(userInfo, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(addUser);
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    const user: UserDTO = req.body;
    // assigne the uploaded file to profilePicture
    user.profilePicture = req.file;

    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await UsersService.CheckIfUsersInSameCompany(connectedUser, id);

    const updatedUser = await UsersService.updateUser(id, user, connectedUser);
    res.status(HttpStatusEnum.SUCCESS).send(updatedUser);
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const connectedUser: IUser = (req as any).iUser;

    await UsersService.CheckIfUsersInSameCompany(connectedUser, id);

    const deleteRespons = await UsersService.deleteUser(req.params.id);

    res.status(HttpStatusEnum.SUCCESS).send(deleteRespons);
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    const connectedUser: IUser = (req as any).iUser;
    const { id: companyId } = req.params;

    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 0)
      : undefined;
    const skip = req.query.skip
      ? parseInt(req.query.skip as string, 0)
      : undefined;

    // eslint-disable-next-line no-underscore-dangle
    await CompaniesService.hasPermissionOn(companyId, connectedUser._id);

    const users = await UsersService.listAllUsers(
      connectedUser,
      companyId,
      limit,
      skip,
    );
    res.status(HttpStatusEnum.SUCCESS).send(users);
  }
}

export default UsersController;
