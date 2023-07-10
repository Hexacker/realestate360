import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from 'config';

import DataStoredInToken from '../features/auth/auth.interface';
import { HttpStatusEnum } from '../shared';
import HttpException from '../exceptions/httpException';
import { AuthService } from '../features/auth';
import { IUser, UsersService } from '../features/users';

const getNewToken = (dataStoredInToken: DataStoredInToken): Promise<string> => {
  return AuthService.createToken(dataStoredInToken.userId, 1);
};

export const OAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  // Get the jwt token from the head
  // #BOTH x-access-token & authorization headers supported
  const tokenHeader: string | undefined = (req.headers['x-access-token'] ||
    // eslint-disable-next-line dot-notation
    req.headers['authorization']) as string;

  // handdle directe & Bearer token
  const token: string =
    tokenHeader && tokenHeader.split(' ')[0].toLowerCase() === 'bearer'
      ? tokenHeader.split(' ')[1]
      : tokenHeader;

  if (!token || token === '' || token.toLowerCase().includes('bearer'))
    // empty token
    next(new HttpException(HttpStatusEnum.UNAUTHORIZED, 'UNAUTHORIZED USER'));
  else {
    try {
      // decod toekn
      const dataStoredInToken: DataStoredInToken = jwt.verify(
        token,
        config.get('jwtSecret'),
      ) as DataStoredInToken;

      const user: IUser | null = await UsersService.getUser(
        dataStoredInToken.userId,
      );

      if (!user) {
        // user deleted
        next(
          new HttpException(HttpStatusEnum.UNAUTHORIZED, 'UNAUTHORIZED USER'),
        );
        return;
      }

      if (!user.isActivated) {
        // locked user
        next(
          new HttpException(
            HttpStatusEnum.FORBIDDEN,
            'Your account is temporarily locked',
          ),
        );
        return;
      }

      // authorized user
      (req as any).iUser = user;

      // send a new token back
      res.setHeader('token', await getNewToken(dataStoredInToken));

      next(); // success
    } catch (err) {
      // expired or invalid token
      next(new HttpException(HttpStatusEnum.UNAUTHORIZED, 'UNAUTHORIZED USER'));
    }
  }
};
