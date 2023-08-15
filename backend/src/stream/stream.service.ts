import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, readFile } from 'fs';
import { resolve, join } from 'path';

@Injectable()
export class StreamService {
  constructor() {}

  async streamText(res: Response) {
    res.write('stram data 보내줄게요');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.write('추가 메시지 1이에요');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.write('추가 메시지 2이에요');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.write('...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    res.end();
  }

  async streamVideo(res: Response) {
    const file = createReadStream(
      resolve(join(process.cwd(), 'uploads/mov_bbb.mp4')),
    );

    res.header('Content-Type', 'video/mp4');

    file.pipe(res);
  }

  async download(res: Response) {
    readFile(
      join(process.cwd(), 'uploads/pngegg.png'),
      'utf-8',
      (err, data) => {
        if (data) {
          res.download(join(process.cwd(), 'uploads/pngegg.png'));
        } else {
          res.status(404).send('파일을 찾을수 없습니다.');
        }
      },
    );
  }
}
