import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import { EnvironmentVariables } from '../config/config.validation';
import { catchError, firstValueFrom, map } from 'rxjs';
import { PrismaService } from '../prisma/prisma.service';
import { Data, Weekly, Daily, Menu, DoW } from '@prisma/client';

@Injectable()
export class MenuService {
  constructor(
    private readonly httpservice: HttpService,
    private configservice: ConfigService<EnvironmentVariables>,
    private readonly prismaservice: PrismaService,
  ) {}

  async ImageReading(image: Express.Multer.File): Promise<Data> {
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
      );

    const result = await this.dataOrganization(
      (await firstValueFrom(responseData)).data,
    );

    return result;
  }

  async dataOrganization(data): Promise<Data> {
    const dow: DoW[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklies = [];
    const goods = [];
    data.images[0].fields.forEach((item) => {
      goods.push(item.inferText);
    });
    const menu = goods.filter((item) => {
      return item != '중식' && item != '석식';
    });
    while (menu[0] != '흰밥*흑미밥') {
      menu.shift();
    }
    while (menu.at(-1) != '야채샐러드') {
      menu.pop();
    }
    for (let i = 0; i < 22; i++) {
      for (let j = 0; j < 5; j++) {
        process.stdout.write(menu[i * 5 + j] + ' ');
      }
      console.log();
    }
    console.dir(menu, { maxArrayLength: null });

    await this.prismaservice.menu.createMany({
      data: menu.map((item) => {
        return { name: item };
      }),
      skipDuplicates: true,
    });

    for (let i = 0; i < 5; i++) {
      const lunch: string[] = [],
        dinner: string[] = [];

      for (let j = 0; j < 11; j++) {
        lunch.push(menu[5 * j + i] ? menu[5 * j + i] : '');
        dinner.push(menu[5 * (11 + j) + i] ? menu[5 * (11 + j) + i] : '');
      }

      const daily = await this.prismaservice.daily.create({
        data: {
          lunch: {
            connect: lunch.map((item) => {
              return { name: item };
            }),
          },
          dinner: {
            connect: dinner.map((item) => {
              return { name: item };
            }),
          },
        },
      });

      const weekly = await this.prismaservice.weekly.create({
        data: {
          day: dow[i],
          content: {
            connect: { id: daily.id },
          },
        },
      });
      weeklies.push(weekly.id);
    }

    await this.prismaservice.data.deleteMany();

    return await this.prismaservice.data.create({
      data: {
        content: {
          connect: weeklies.map((item) => {
            return { id: item };
          }),
        },
      },
    });
  }
}
