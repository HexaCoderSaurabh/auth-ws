import { ConfigService } from '@nestjs/config';
import * as transport from 'nodemailer-ses-transport';

const configService = new ConfigService();
const awsConfig = {
  region: configService.get<string>('SES_AWS_REGION'),
  accessKeyId: configService.get<string>('SES_AWS_ACCESS_KEY_ID'),
  secretAccessKey: configService.get<string>('SES_AWS_SECRET_ACCESS_KEY')
};

export default transport(awsConfig);
