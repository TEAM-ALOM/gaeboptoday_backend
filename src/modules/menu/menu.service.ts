import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EnvironmentVariables } from '../config/config.validation';
import { catchError, map } from 'rxjs';

@Injectable()
export class MenuService {
  constructor(
    private readonly httpservice: HttpService,
    private configservice: ConfigService<EnvironmentVariables>,
  ) {}

  async ImageReading(image: Express.Multer.File): Promise<any> {
    const FormData = require('form-data');
    const formdata = new FormData();
    const message = {
      version: 'V2',
      timestamp: Date.now(),
      requestId: randomUUID(),
      images: [
        { format: image.mimetype.split('/')[1], name: image.originalname },
      ],
    };

    formdata.append('message', JSON.stringify(message));
    formdata.append('file', image.buffer, image.originalname);

    const baseURL = this.configservice.get<string>('OCR_INVOKE_URL');
    const key = this.configservice.get<string>('NAVER_OCR_SECRET');
    const result = await this.httpservice
      .post(baseURL, formdata, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-OCR-SECRET': key },
      })
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      )
      .pipe(map((response) => response.data));
    return result;
  }
}
