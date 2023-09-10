import { Controller, Get } from '@nestjs/common';

@Controller('media-server')
export class MediaServerController {
  @Get()
  async getStream() {
    return fetch('http://localhost:3034/api/streams').then((res) => res.json());
  }
}
