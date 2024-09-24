import {
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseDto } from 'src/types/response.dto';
import { Data, Menu } from '@prisma/client';
import { DataService } from '../data/data.service';
import { JwtAccessGuard } from '../auth/guard/jwt-access.guard';

@ApiTags('메뉴 관련 api')
@Injectable()
@Controller('/menu')
export class MenuController {
  constructor(
    private readonly menuservice: MenuService,
    private readonly dataservice: DataService,
  ) {}

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
    type: ResponseDto<Data>,
  })
  @UseInterceptors(FileInterceptor('image'))
  async uploadMenuImage(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<ResponseDto<any>> {
    await this.menuservice.ImageReading(file);

    const data = await this.dataservice.getData();

    return ResponseDto.created('ocr_success', { result: data });
  }

  @Get()
  @ApiOperation({
    summary: '메뉴 전부 가져오기(평점 순 정렬)',
  })
  @ApiResponse({
    type: ResponseDto<Menu[]>,
  })
  async getMenus() {
    const result = await this.menuservice.findMany();

    return ResponseDto.success('inquiry_success', result);
  }

  @Get('/:name')
  @ApiOperation({
    summary: '단일 메뉴 조회',
  })
  @ApiParam({
    name: 'name',
    type: String,
    description: '메뉴 이름',
  })
  @ApiResponse({
    type: ResponseDto<Menu>,
  })
  async getMenu(@Param('name') name: string): Promise<ResponseDto<Menu>> {
    const result = await this.menuservice.findOneByName(name);

    return ResponseDto.success('inquiry_success', result);
  }

  @Post('/:name')
  @ApiOperation({
    summary: '메뉴 즐겨찾기',
  })
  @ApiParam({
    name: 'name',
    type: String,
    description: '메뉴 이름',
  })
  @ApiBearerAuth('token')
  @UseGuards(JwtAccessGuard)
  async starMenu(@Param('name') name: string, @Req() request) {
    const result = await this.menuservice.starMenu(
      name,
      request.user.studentCode,
    );

    if (result) {
      return ResponseDto.created('bookmark_success');
    }
  }
}
