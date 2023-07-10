/* eslint-disable array-callback-return */
/* eslint-disable no-loop-func */
/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */

import { Request, Response, NextFunction } from 'express';
import HttpException from '../exceptions/httpException';
import { isAllowTo } from '../features/roles/resources';
import { IUser } from '../features/users';
import { HttpStatusEnum } from '../shared';

export const checkRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const connectedUser: IUser = (req as any).iUser;

    if (!connectedUser)
      next(
        new HttpException(
          HttpStatusEnum.SERVER_ERROR,
          'PLEASE USE OAUTH BEFOR',
        ),
      );

    const path: string = req.baseUrl.concat(req.path);

    let authorized = false;

    for (const role of connectedUser.roles) {
      // skip the role if it is inactive
      if (!role.isActivated) continue;
      role.permissions.map(permissionCode => {
        if (
          isAllowTo(
            permissionCode,
            path,
            req.method.toUpperCase(),
            Object.keys(req.params),
          )
        )
          authorized = true;
      });
    }

    if (authorized) return next();

    return next(
      new HttpException(
        HttpStatusEnum.FORBIDDEN,
        "You don't have permission to access, Please contact your Administrator",
      ),
    );
  } catch (error) {
    return next(
      new HttpException(
        HttpStatusEnum.FORBIDDEN,
        "You don't have permission to access, Please contact your Administrator",
      ),
    );
  }
};
