import { Module } from '@nestjs/common';
import { SocketGateway } from './socket.gateway';
import { TestGateway } from './test.gateway';

@Module({
  providers: [SocketGateway, TestGateway],
})
export class SocketModule {}
