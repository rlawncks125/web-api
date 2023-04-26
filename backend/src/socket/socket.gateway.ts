import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UserOffer {
  clientId: string;
  offer: any;
}
interface UserIcecandidate {
  clientId: string;
  icecandidate: any;
}

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'webRPC',
})
export class SocketGateway {
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

  @SubscribeMessage('joinRoom')
  joinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    room: string,
  ): void {
    client.join(room);
  }

  @SubscribeMessage('offer')
  offer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, offer }: { room: string; offer: any },
  ): void {
    if (Number.isInteger(offer)) return;

    client.broadcast.to(room).emit('recived_offer', offer);
  }

  @SubscribeMessage('answer')
  answer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, answer }: { room: string; answer: any },
  ): void {
    client.broadcast.to(room).emit('recived_answer', answer);
  }

  @SubscribeMessage('candidate')
  Icecandidate(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, candidate }: { room: string; candidate: any },
  ): void {
    client.broadcast.to(room).emit('recived_candidate', candidate);
  }
}
