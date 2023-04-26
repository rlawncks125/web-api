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

  offerLists = new Map<string, UserOffer[]>();
  icecandidateLists = {};
  userJoinRoomLists = {};
  constructor() {}

  handleConnection(client: Socket) {
    console.log('연결', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log(`연결 해제  : ${client.id}`);

    // console.log('client obejct', this.userJoinRoomLists);
    // console.log('client Rooms', this.userJoinRoomLists[client.id]);
    const joinRooms = new Array(this.userJoinRoomLists[client.id]).flat();

    joinRooms.forEach((roomName) => {
      // console.log('remove', roomName);
      this.leaveUserClean(client, roomName);
    });
    // console.log(this.offerLists);

    delete this.userJoinRoomLists[client.id];
    delete this.icecandidateLists[client.id];
  }

  checkListsRooms = () => {
    // @ts-ignore
    console.log('방 체크', this.server.adapter.rooms);
  };

  leaveUserClean = (client: Socket, roomName: string) => {
    const lists = this.offerLists.get(roomName);

    if (lists && lists.length > 0) {
      this.offerLists.set(
        roomName,
        lists.filter((v) => v.clientId !== client.id),
      );

      this.offerLists.get(roomName).length === 0 &&
        this.offerLists.delete(roomName);
    } else {
      this.offerLists.delete(roomName);
    }
  };

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    payload: any,
  ): void {
    console.log(payload);

    client.emit('answer', payload);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, offer }: { room: string; offer: any },
  ): void {
    // console.log(room, offer);

    client.join(room);

    const lists = this.offerLists.get(room);
    const newUser: UserOffer = {
      clientId: client.id,
      offer,
    };

    // 방안에 유저 리스트 확인
    if (lists) {
      client.emit('userLists', lists);
      client.broadcast.to(room).emit('joinUser', newUser);

      this.offerLists.set(room, [...lists, newUser]);
    } else {
      // this.server.to(room).emit('joinUser', newUser);
      client.broadcast.to(room).emit('joinUser', newUser);

      this.offerLists.set(room, [newUser]);
    }

    // 유저가 방문한 방 리스트 등록
    const joinRoomLists = this.userJoinRoomLists[client.id];
    if (joinRoomLists) {
      this.userJoinRoomLists[client.id] = [...joinRoomLists, room];
    } else {
      this.userJoinRoomLists[client.id] = [room];
    }
  }
  @SubscribeMessage('answer')
  answer(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, answer }: { room: string; answer: any },
  ): void {
    // console.log(room, answer);
    client.broadcast.to(room).emit('Canser', answer);
  }

  @SubscribeMessage('icecandidate')
  Icecandidate(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, icecandidate }: { room: string; icecandidate: any },
  ): void {
    const lists = this.icecandidateLists[client.id];
    const newUser: UserIcecandidate = {
      clientId: client.id,
      icecandidate,
    };

    // 방안에 유저 리스트 확인
    if (lists) {
      client.emit('iceLists', this.icecandidateLists);
    }
    client.broadcast.to(room).emit('ice', newUser);

    this.icecandidateLists[client.id] = newUser;
  }

  @SubscribeMessage('leaveUser')
  leaveUser(
    @ConnectedSocket()
    client: Socket,
    @MessageBody()
    { room, stream }: { room: string; stream: any },
  ): void {
    console.log(room, stream);
    this.server.to(room).emit('leaveUser', stream);
  }
}
