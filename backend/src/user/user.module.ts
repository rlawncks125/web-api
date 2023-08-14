import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { PostService } from './post.service';
import { UserController } from './user.controller';

import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, PostService],
  controllers: [UserController],
})
export class UserModule {}
