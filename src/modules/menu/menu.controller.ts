import {
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { data } from '@prisma/client';

@ApiTags('이미지 OCR api')
@Injectable()
@Controller('/menu')
export class MenuController {
  constructor(private readonly menuservice: MenuService) {}

  @Post('/upload')
  @ApiOperation({
    summary: '이미지 OCR',
    description: '이미지를 토대로 OCR 요청을 보냅니다.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    type: ResponseDto<data>,
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadMenuImage(@UploadedFile() file: Express.Multer.File): Promise<ResponseDto<data>> {
    const result = await this.menuservice.ImageReading(file);

    return ResponseDto.created('ocr_success', result);
  }
}
