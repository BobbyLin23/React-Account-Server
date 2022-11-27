import {
  Controller,
  Post,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import fs from 'fs';
import * as qiniu from 'qiniu';

@Controller('upload')
export class UploadController {
  constructor() {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file, @Res() response: Response) {
    console.log(file);
    //let f = fs.readFileSync(file);
    //const mac = new qiniu.auth.digest.Mac('1', '2');

    return response.send({});
  }
}
