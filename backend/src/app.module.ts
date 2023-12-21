import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StreamModule } from './stream/stream.module';
import { CookieModule } from './cookie/cookie.module';
import { OpenaiModule } from './openai/openai.module';
import { MediaServerModule } from './media-server/media-server.module';
import { OllamaModule } from './ollama/ollama.module';

@Module({
  imports: [
    SocketModule,
    ConfigModule.forRoot({
      load: [
        () => ({
          DATABASE_URL: process.env.DATABASE_URL,
        }),
      ],
    }),
    UserModule,
    PrismaModule,
    StreamModule,
    CookieModule,
    OpenaiModule,
    MediaServerModule,
    OllamaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
