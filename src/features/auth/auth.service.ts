import bcrypt from 'bcrypt';
import config from 'config';
import * as jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import { EmailService } from '../email';
import { IUser, User, UsersService } from '../users';
import DataStoredInToken from './auth.interface';
import LoginDTO from './dtos/login.dto';
import ResetPasswordDTO from './dtos/resetPassword.dto';
import UpdatePasswordDTO from './dtos/updatePassword.dto';

export default class AuthService {
  static login = async (loginDTO: LoginDTO): Promise<any> => {
    const findUser: IUser | null = await User.findOne({
      email: loginDTO.email,
    });
    if (findUser && findUser.password) {
      const verifyPassword = await bcrypt.compare(
        loginDTO.password,
        findUser.password,
      );
      if (verifyPassword) {
        if (findUser.isActivated) {
          const expiresIn = 24; // 24 hours
          const token = AuthService.createToken(findUser._id, expiresIn);
          return token;
        }
        return Promise.reject(
          new HttpException(HttpStatusEnum.BAD_REQUEST, 'User is inactive'),
        );
      }
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Password is not correct',
        ),
      );
    }
    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found'),
    );
  };

  static createToken = async (
    userId: string,
    expiresIn: number, // in hours
  ): Promise<string> => {
    const secret: string = config.get('jwtSecret');

    const expireAt = new Date();
    expireAt.setHours(expireAt.getHours() + expiresIn);

    const dataStoredInToken: DataStoredInToken = {
      userId,
      createdAt: new Date(),
      expireAt,
    };

    const token = jwt.sign(dataStoredInToken, secret, {
      expiresIn: `${expiresIn}h`,
    });
    return token;
  };

  static updatePassword = async (
    connectedUser: IUser,
    updatePasswordDTO: UpdatePasswordDTO,
  ): Promise<any> => {
    if (connectedUser.email !== updatePasswordDTO.email)
      return Promise.reject(
        new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not authaurized'),
      );

    const findUser: IUser | null = await User.findOne({
      email: updatePasswordDTO.email,
    });
    if (findUser && findUser.password) {
      const checkPass = await bcrypt.compare(
        updatePasswordDTO.oldPassword,
        findUser.password,
      );
      if (checkPass) {
        const hashedPassword: string = UsersService.hashPassword(
          updatePasswordDTO.newPassword,
        );

        findUser.password = hashedPassword;
        await User.updateOne({ email: updatePasswordDTO.email }, findUser);
        return 'Password has been updated successfully';
      }
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'Old passowrd is not correct',
        ),
      );
    }
    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'User not found'),
    );
  };

  static generatePasswordResetToken = async (email: string): Promise<any> => {
    try {
      const findUser: IUser | null = await User.findOne({ email });

      if (!findUser || !findUser.isActivated) {
        throw 'Error';
      }

      const expiresIn = 1; // 1 hours
      // eslint-disable-next-line no-return-await
      const token: string = await AuthService.createToken(
        findUser._id,
        expiresIn,
      );

      return EmailService.sendMail({
        to: email,
        subject: 'reset password',
        text: `Please click ici to reset your password : ${config.get(
          'SERVER_HOST',
        )}/api/v1/auth/reset/${token}`,
      });
    } catch {
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'User not found or is not active',
        ),
      );
    }
  };

  static resetPassword = async (
    token: string,
    resetPasswordDTO: ResetPasswordDTO,
  ): Promise<any> => {
    const verifyToken = jwt.verify(token, config.get('jwtSecret'));
    if (verifyToken) {
      const tokenInfo: any = jwtDecode(token);
      const getUser: IUser | null = await User.findOne({
        email: tokenInfo.email,
      });
      if (getUser) {
        const hashedPassword: string = UsersService.hashPassword(
          resetPasswordDTO.newPassword,
        );
        getUser.password = hashedPassword;
        await User.updateOne({ username: tokenInfo.username }, getUser);
        return 'Password Has been reseted successfully';
      }
      return Promise.reject(
        new HttpException(
          HttpStatusEnum.BAD_REQUEST,
          'User not found or is not active',
        ),
      );
    }
    return Promise.reject(
      new HttpException(HttpStatusEnum.BAD_REQUEST, 'Invalid Token'),
    );
  };
}
