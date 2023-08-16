import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';

@Controller('cookie')
export class CookieController {
  @Get()
  getCookie(@Res() res: Response) {
    const day = 1;
    res.cookie('jwt', new Date().getTime(), {
      httpOnly: true,
      secure: true,
      // maxAge: day * 24 * 60 * 60 * 1000, // 1day
      // maxAge: day * 60 * 1000, // 1분후
      // expires 1분후
      expires: new Date(new Date().getTime() + day * 60 * 1000),
    });

    return res.send('ok');
  }
  @Post()
  checkCookie(@Req() request: Request) {
    console.log(request.cookies);
  }
}

// maxAge 와 expires 차이
// maxAge 최대 사용 기간(초) : 초단위 시간을 지정
// expires 만료 날짜 : 만료되는 날짜와 시간을 지정
// 두개다 설정됬을시 maxAge 우선
