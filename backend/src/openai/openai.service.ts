import { Injectable } from '@nestjs/common';
import { Response } from 'express';

import OpenAI from 'openai';

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
    { content, model }: { content: string; model: string },
  ) {
    const chatCompletion = await this.openai.chat.completions.create({
      model,
      messages: [{ role: 'user', content }],
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

    res.send(url);
  }
}
