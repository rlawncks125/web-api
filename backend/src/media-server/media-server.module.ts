import { Module } from '@nestjs/common';
import { MediaServerController } from './media-server.controller';
import { MediaServerService } from './media-server.service';

@Module({
  controllers: [MediaServerController],
  providers: [MediaServerService]
})
export class MediaServerModule {}
