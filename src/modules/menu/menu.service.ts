import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EnvironmentVariables } from '../config/config.validation';
import { catchError, map } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { DoW, menu, menu_imbed } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(
    private readonly httpservice: HttpService,
    private configservice: ConfigService<EnvironmentVariables>,
    private readonly prismaservice: PrismaService,
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
    const responseData = await this.httpservice
      .post(baseURL, formdata, {
        headers: { 'Content-Type': 'multipart/form-data', 'X-OCR-SECRET': key },
      })
      .pipe(
        catchError((e) => {
          throw new HttpException(e.response.data, e.response.status);
        }),
      )
      .pipe(map((response) => response.data));

    const result = await this.dataOrganization(responseData);

    return result;
  }

  async dataOrganization(data) {
    const menus = [];
    Object.values(DoW).forEach((date) => {
      menus.push({
        Day: date,
        content: {
          create: { lunch: [], dinner: [] },
        },
      });
    });

    await this.prismaservice.data.create({
      data: {
        content: {
          create: menus,
        },
      },
    });
  }
}
