import { HttpService } from '@nestjs/axios';
import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
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
    if (data.images[0].message != 'SUCCESS') {
      throw new BadRequestException('이미지가 잘못되었습니다.');
    } else if (data.images[0].fields.length < 3) {
      throw new BadRequestException('이미지가 잘못되었습니다.');
    }
    console.log(data);
    const dow: DoW[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklies: string[][] = [];
    const weeklyIds = [];
    for (let i = 0; i < data.images[0].fields.length; i++) {
      const temp = data.images[0].fields[i].inferText.split('\n');
      temp.shift();
      weeklies.push(temp);
    }

    weeklies.forEach(async (daily) => {
      await this.prismaservice.menu.createMany({
        data: daily.map((item) => {
          return { name: item };
        }),
        skipDuplicates: true,
      });
    });

    for (let i = 0; i < weeklies.length; i++) {
      const lunch: string[] = [],
        dinner: string[] = [];

      const range = Math.round(weeklies[i].length / 2);
      for (let j = 0; j < range; j++) {
        if (range < 8) {
          break;
        }
        lunch.push(weeklies[i][j] ? weeklies[i][j] : '');
        dinner.push(weeklies[i][j + range] ? weeklies[i][j + range] : '');
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

      const weeklyData = await this.prismaservice.weekly.create({
        data: {
          day: dow[i],
          content: {
            connect: { id: daily.id },
          },
        },
      });
      weeklyIds.push(weeklyData.id);
    }

    return await this.prismaservice.data.create({
      data: {
        content: {
          connect: weeklyIds.map((item) => {
            return { id: item };
          }),
        },
      },
    });
  }
}
