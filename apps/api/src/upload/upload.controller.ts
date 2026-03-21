import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const uniqueSuffix = uuidv4() + extname(file.originalname);
        cb(null, uniqueSuffix);
      }
    }),
    fileFilter: (req, file, cb) => {
       if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
           return cb(new BadRequestException('Only image files are allowed!'), false);
       }
       cb(null, true);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    // Return relative url path to be saved and loaded
    return {
      url: `/uploads/${file.filename}`
    };
  }
}
