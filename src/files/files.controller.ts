import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Res,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeValidationPipe } from './validator';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Request, Response } from 'express';
import { hostname } from 'os';
import { fileValidationOptions } from './file.validation';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      dest: './uploaded_files',
    }),
  )
  uploadFile(
    @UploadedFile(new ParseFilePipe(fileValidationOptions))
    file: Express.Multer.File,
    @Body() body: any,
    @Req() req: Request,
  ) {
    body = {
      fileurl: `${req.headers.host}/files/${file.filename}`,
      ...body,
    };
    console.log(file);
    return body;
  }

  @Get(':folder/:filename')
  getFile(
    @Res({ passthrough: true }) res: Response,
    @Param('folder') folder: string,
    @Param('filename') filename: string,
  ): StreamableFile {
    const file = createReadStream(
      join(process.cwd(), `/uploaded_files/${folder}/${filename}`),
    );
    res.set({
      'Content-Type': 'image/jpeg',
      'Content-Disposition': 'attachment; filename="file.jpg"',
    });
    return new StreamableFile(file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
