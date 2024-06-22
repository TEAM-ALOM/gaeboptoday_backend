import {
  Body,
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { ImageService } from './image.service';
import { ImageMappingDto } from './image.dto';
import { Menu } from '@prisma/client';

@Injectable()
@Controller('/image')
export class ImageController {
  constructor(private readonly imageservice: ImageService) {}

  @Post('/upload')
  @ApiOperation({
    summary: '이미지 업로드',
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
    type: ResponseDto<string>,
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadImageImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    const result = await this.imageservice.imageUploadToS3(file);

    return ResponseDto.created('upload_success', result);
  }

  @Post('/')
  @ApiOperation({
    summary: '이미지 주소와 메뉴를 매핑',
  })
  @ApiBody({ type: ImageMappingDto })
  async imageMapping(@Body() data: ImageMappingDto): Promise<ResponseDto<Menu>> {
    const result = await this.imageservice.imageMapping(data);

    return ResponseDto.success('mapping_success', result);
  }
}
