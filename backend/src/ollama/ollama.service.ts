import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { Stream } from 'stream';
import fetch from 'node-fetch';

@Injectable()
export class OllamaService {
  constructor() {}

  async openaiText(
    res: Response,
    { prompt, model }: { prompt: string; model: string },
  ) {
    console.log('text Model : ', model, prompt);

    // docker에서 localhost 접근 하는 주소 : host.docker.internal
    const respone = await fetch(
      'http://host.docker.internal:11434/api/generate',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          prompt,
        }),
      },
    );

    try {
      for await (const chunk of respone.body) {
        const data = JSON.parse(chunk.toString());
        console.log(data);
        res.write(data.response);
      }
    } catch (err) {
      console.error(err);
    }

    res.end();
  }
}
