import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketModule } from './socket/socket.module';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { StreamModule } from './stream/stream.module';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
