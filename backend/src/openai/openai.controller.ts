import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { Response } from 'express';

@Controller('openai')
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}

  @Post('text')
  text(@Res() respone: Response, @Body() body) {
    return this.openaiService.openaiText(respone, body);
  }

  @Post('image')
  image(@Res() respone: Response, @Body() body) {
    return this.openaiService.openaiImage(respone, body);
  }
}
