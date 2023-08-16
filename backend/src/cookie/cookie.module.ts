import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { CookieController } from './cookie.controller';

@Module({
  providers: [CookieService],
  controllers: [CookieController]
})
export class CookieModule {}
