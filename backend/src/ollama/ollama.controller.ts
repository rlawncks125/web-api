import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { OllamaService } from './ollama.service';
import { Response } from 'express';

@Controller('ollama')
export class OllamaController {
  constructor(private readonly ollamaService: OllamaService) {}

  @Post('text')
  async getOllama(@Res() respone: Response, @Body() body) {
    return this.ollamaService.openaiText(respone, {
      model: 'mistral',
      prompt: body.prompt,
    });
  }
}
