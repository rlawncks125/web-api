import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { createWriteStream, writeFile } from 'fs';

import OpenAI from 'openai';
import { join } from 'path';
import { Readable } from 'stream';

// https://github.com/openai/openai-node/discussions/217

@Injectable()
export class OpenaiService {
  openai: OpenAI;
  constructor() {
    console.log('openai');

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI,
    });
  }

  async openaiText(
    res: Response,
    { messages, model }: { messages: any[]; model: string },
  ) {
    const chatCompletion = await this.openai.chat.completions.create({
      model,
      messages,
      max_tokens: 1000,
      stream: true,
    });

    for await (const part of chatCompletion) {
      res.write(part.choices[0]?.delta?.content || '');
    }

    res.end();
  }

  async openaiImage(res: Response, { content }: { content: string }) {
    const response = await this.openai.images.generate({
      prompt: content,
      n: 1,
      size: '512x512',
    });
    const url = response['data'][0]['url'];

    // 파일 저장
    const buf = await fetch(url).then(res => res.arrayBuffer())
    const base64String = Buffer.from(buf).toString("base64");
    this.wirteFileByBase64Image(base64String)
        
    

    res.send(url);
  }

  async wirteFileByBase64Image(base64: string) {
    new Date(Date.now()).toISOString();
    const today = new Date(Date.now()).toISOString().split('T')[0];
    const time = Date.now();

    const fileName = `Dalle-2-${today}-${time}`;
    const filePath = join(process.cwd(), `uploads/${fileName}.png`);

    // data:image/png;base64,{base64-string} 형식일떄
    // base64 데이터 추출
 

    return new Promise((res, rej) => {
      writeFile(filePath, base64, { encoding: 'base64' }, (err) => {
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
