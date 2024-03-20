import { Controller, Get, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CustomService } from './custom.service';
import { EModule } from 'src/shared/constants/EModules';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/multer/multer.config';

@Controller(EModule.CUSTOM)
export class CustomController {
  constructor(private readonly customService: CustomService) {}

  @Get('get-link')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  getLink(@UploadedFile() file: Express.Multer.File) {
    return this.customService.getLink(file);
  }

  @Get('change-link')
  @UseInterceptors(FileInterceptor('file', multerConfig))
  customLink(@UploadedFile() file: Express.Multer.File) {
    return this.customService.customLink(file);
  }
}
