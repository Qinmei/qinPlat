import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from './file.service';
import { File } from './file.entity';
import { FileController } from './file.controller';

@Module({
  imports: [TypeOrmModule.forFeature([File])],
  exports: [FileService],
  providers: [FileService],
  controllers: [FileController],
})
export class FileModule {}
