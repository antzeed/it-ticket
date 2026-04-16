import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { S3Service } from './s3.service';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly s3Service: S3Service) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
    fileFilter: (req, file, cb) => {
       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
           return cb(new BadRequestException('Only image files are allowed!'), false);
       }
       cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    
    // Upload the file to S3
    const s3Url = await this.s3Service.uploadFile(file);

    // Return absolute S3 url to be saved in DB
    return {
      url: s3Url
    };
  }
}
