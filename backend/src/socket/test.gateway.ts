import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'test',
})
export class TestGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  handleConnection(client: Socket) {
    console.log('연결', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`연결 해제  : ${client.id}`);
  }

  checkListsRooms = () => {
    // @ts-ignore
    console.log('방 체크', this.server.adapter.rooms);
  };

  @SubscribeMessage('ping')
  ping(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    payload: any,
  ): void {
    console.log(client.id, payload);

    client.broadcast.emit('pong', payload + ' pong!!');
    // this.server.emit('pong', payload + ' pong!!');
  }
}
