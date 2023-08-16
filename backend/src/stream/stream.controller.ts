import { Controller, Get, Res } from '@nestjs/common';
import { Response, response } from 'express';
import { StreamService } from './stream.service';

@Controller('stream')
export class StreamController {
  constructor(private readonly streamService: StreamService) {}
  @Get('text')
  streamText(@Res() respone: Response) {
    return this.streamService.streamText(respone);
  }

  @Get('video')
  streamVideo(@Res() respone: Response) {
    return this.streamService.streamVideo(respone);
  }

  @Get('file/download')
  getDownload(@Res() respone: Response) {
    return this.streamService.download(respone);
  }

  @Get('watch')
  watchFile(@Res() respone: Response) {
    return this.streamService.chageFileWatch(respone);
  }

  @Get('watch/end')
  endWatch() {
    return this.streamService.watchEnd();
  }
}
