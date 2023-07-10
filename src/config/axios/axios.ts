import axios from 'axios';
import config from 'config';
import { HttpStatusEnum } from '../../shared';
import HttpException from '../../exceptions/httpException';

const onRejected = (err: any): any => {
  const errMessage = err.response
    ? err.response
    : 'Could not get any response from the main wallet server';
  return Promise.reject(
    new HttpException(HttpStatusEnum.NOT_FOUND, errMessage),
  );
};
