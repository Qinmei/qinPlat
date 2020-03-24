import { Module } from '@nestjs/common';
import Next from 'next';
import { RenderModule } from 'nest-next';

@Module({
  imports: [
    RenderModule.forRootAsync(
      Next({ dev: process.env.NODE_ENV !== 'production' }),
    ),
  ],
})
export class NextModule {}
