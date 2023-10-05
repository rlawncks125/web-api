import { Controller, Get, Res, Sse } from '@nestjs/common';
import { Response } from 'express';
import { StreamService } from './stream.service';
import { Observable, Subject, interval, map } from 'rxjs';

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

  @Get('image')
  getImage(@Res() response: Response) {
    return this.streamService.getImageStream(response);
  }

  @Get('watch')
  watchFile(@Res() respone: Response) {
    return this.streamService.chageFileWatch(respone);
  }

  @Get('watch/end')
  endWatch() {
    return this.streamService.watchEnd();
  }

  @Sse('sse')
  sse(): Observable<any> {
    // 1 방법
    // return interval(2000).pipe(
    //   map((number) => ({ data: { date: 'hllow :' + number } })),
    // );

    // 2방법
    const subject = new Subject();
    setInterval(() => {
      subject.next({ hllo: 'hllo next 데이터' });
    }, 2000);

    return subject.pipe(map((data) => ({ data })));
  }

  @Get('noStream/image/base64')
  async imageByBase64() {
    return this.streamService.imageBybase64();
  }
}
