import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class AppService {
  #transporter: nodemailer.Transporter;
  constructor() {
    // this.#transporter = nodemailer.createTransport({
    //   name: '호스팅거 메일러 테스트 <jucahndev.xyz>',
    //   host: 'smtp.hostinger.com',
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.HOSTINGER_EMIAL,
    //     pass: process.env.HOSTINGER_PASS,
    //   },
    // });
  }

  getHello(): string {
    return 'Hello World!!';
  }

  async sendMailer(paylaod: any): Promise<any> {
    console.log(paylaod);
    return await this.#transporter.sendMail({
      from: '"김주찬 메일" <test@juchandev.xyz>',
      to: 'rlawncks125@naver.com',
      subject: paylaod.title,
      html: `
      <div style="margin: auto; text-align: center">
      <h1> ${paylaod.test}</h1>
      <div style="border: 1px solid black">
        <p>로컬 사이트를 가고 싶은면 버튼을 눌러주세여</p>
        <div style="padding: 1rem">
          <a
            href=https://mylocal.juchandev.xyz
            style="
              text-decoration: none;
              padding: 0.5rem 1rem;
              color: white;
              background-color: #5959fb;
              border-radius: 1px;
              border-color: white;
            "
          >
            접속 하기
          </a>
        </div>
      </div>
      `,
    });
  }
}
