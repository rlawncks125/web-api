import { Injectable, StreamableFile } from '@nestjs/common';
import { Response } from 'express';
import {
  createReadStream,
  readFile,
  watchFile,
  readFileSync,
  watch,
  FSWatcher,
  ReadStream,
  writeFile,
} from 'fs';
import { toBase64 } from 'openai/core';
import { resolve, join } from 'path';

@Injectable()
export class StreamService {
  wathResponse: Response;
  StateWatcher: FSWatcher;
  oldLength = 0;

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

  async getImageStream(res: Response) {
    const filePath = join(process.cwd(), 'uploads/pngegg.png');

    const file = createReadStream(resolve(filePath));
    res.header('Content-Type', 'image/png');
    file.pipe(res);
  }

  async chageFileWatch(res: Response) {
    if (this.wathResponse) return;

    console.log('watching');
    this.wathResponse = res;

    const filePath = join(process.cwd(), 'watch.txt');

    const data = readFileSync(filePath, 'utf-8');
    this.oldLength = data.length;
    this.wathResponse.write(data);

    this.StateWatcher = watch(filePath, (curr, prev) => {
      const data = readFileSync(filePath, 'utf-8');
      // console.log('---------------');
      // console.log('파일 변경 감지');
      // console.log('---------------');

      // 변경된 내용만 추가하고 싶을떄

      const changeData = data.slice(this.oldLength, data.length);
      console.log('변경된 내용 :', changeData);

      if (data.length !== 0) {
        this.oldLength = data.length;
        this.wathResponse.write(changeData);
      }
    });
  }

  async watchEnd() {
    console.log('watch 중단');
    this.wathResponse && this.wathResponse.end();
    this.StateWatcher && this.StateWatcher.close();

    this.oldLength = 0;
    this.wathResponse = null;
    return '중단';
  }

  async imageBybase64() {
    const filePath = join(process.cwd(), 'uploads/pngegg.png');
    const ext = 'png';
    // src형식 `data:image/png;base64,{base64-string}`
    // data:파일형식;encoding-type,data

    return new Promise((res, rej) => {
      readFile(filePath, 'base64', (err, data) => {
        if (err) {
          rej('실패');
        }
        res({
          data: `data:image/${ext};base64,${data}`,
        });
      });
    });

    // reafileSync 동기식
    // const data = readFileSync(filePath, 'base64');
    // return { data };
  }

  async wirteFileByBase64Image(imageData: string) {
    new Date(Date.now()).toISOString();
    const today = new Date(Date.now()).toISOString().split('T')[0];
    const time = Date.now();

    const fileName = `테스트-${today}-${time}`;
    const filePath = join(process.cwd(), `uploads/${fileName}.png`);

    const base64String = imageData.split(';base64').pop();

    return new Promise((res, rej) => {
      writeFile(filePath, base64String, { encoding: 'base64' }, (err) => {
        rej({
          status: 'error',
          err,
        });
      });

      res({
        status: 'success',
      });
    });
  }
}
