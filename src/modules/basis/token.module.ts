import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { Config } from '../../config';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: Config.JwtSecret,
      signOptions: { expiresIn: Config.JwtExpired },
    }),
  ],
  exports: [JwtModule],
})
export class TokenModule {}
