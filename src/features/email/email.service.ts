import config from 'config';
import sgMail from '@sendgrid/mail';
import HttpException from '../../exceptions/httpException';
import { HttpStatusEnum } from '../../shared';
import SendMailDTO from './email.dto';

export default class EmailService {
  static sendMail = async (mailDTO: SendMailDTO): Promise<any> => {
    sgMail.setApiKey(config.get('Sendgrid_API_KEY'));

    const { to, text = '', subject = '' } = mailDTO;

    const sendingMail = await sgMail.send({
      from: config.get('Sendgrid_SENDER'),
      to,
      text,
      subject,
    });

    if (sendingMail) {
      return `${mailDTO.subject} has been sent successfuly to ${mailDTO.to}`;
    }
    return Promise.reject(
      new HttpException(
        HttpStatusEnum.BAD_REQUEST,
        'There was an error while sending the email',
      ),
    );
  };
}
