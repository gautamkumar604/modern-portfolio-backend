import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { diskStorage } = require('multer');
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

const uploadsDir = join(process.cwd(), 'uploads');
if (!existsSync(uploadsDir)) {
  mkdirSync(uploadsDir, { recursive: true });
}

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'superadmin')
export class UploadController {
  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadsDir,
        filename: (req: any, file: any, cb: any) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname).toLowerCase();
          const cleanName = file.originalname
            .replace(ext, '')
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '-');
          cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
        },
      }),
      fileFilter: (req: any, file: any, cb: any) => {
        const allowedMimeTypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
          'image/svg+xml',
          'application/pdf',
        ];
        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(
            new BadRequestException(
              'Unsupported file format. Please upload an image (JPG, PNG, WebP, GIF, SVG) or PDF document.',
            ),
            false,
          );
        }
        cb(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 10 MB maximum file size limit
      },
    }),
  )
  uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file was uploaded.');
    }
    const relativeUrl = `/uploads/${file.filename}`;
    return {
      url: relativeUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }
}
