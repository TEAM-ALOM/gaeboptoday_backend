import {
  Controller,
  Injectable,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MenuService } from './menu.service';

@Injectable()
@Controller('/menu')
export class MenuController {
  constructor(private readonly menuservice: MenuService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMenuImage(@UploadedFile() file: Express.Multer.File) {
    const result = await this.menuservice.ImageReading(file);

    return result;
  }
}
