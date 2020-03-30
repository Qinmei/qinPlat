import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { Upload } from './upload.entity';
import { FileModule, TokenModule } from '../index';

@Module({
  imports: [TypeOrmModule.forFeature([Upload]), TokenModule, FileModule],
  exports: [UploadService],
  providers: [UploadService],
  controllers: [UploadController],
})
export class UploadModule {}
