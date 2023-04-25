import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

interface UserData {
  clientId: string;
  offer: any;
}

@WebSocketGateway({
  transports: ['websocket'],
  namespace: 'webRPC',
})
export class SocketGateway {
  @WebSocketServer()
  server: Server;

  tempLists = new Map<string, UserData[]>();
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
    // console.log(this.tempLists);

    delete this.userJoinRoomLists[client.id];
  }

  checkListsRooms = () => {
    // @ts-ignore
    console.log('방 체크', this.server.adapter.rooms);
  };

  leaveUserClean = (client: Socket, roomName: string) => {
    const lists = this.tempLists.get(roomName);

    if (lists && lists.length > 0) {
      this.tempLists.set(
        roomName,
        lists.filter((v) => v.clientId !== client.id),
      );

      this.tempLists.get(roomName).length === 0 &&
        this.tempLists.delete(roomName);
    } else {
      this.tempLists.delete(roomName);
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

    const lists = this.tempLists.get(room);
    const newUser: UserData = {
      clientId: client.id,
      offer,
    };

    // 방안에 유저 리스트 확인
    if (lists) {
      client.emit('userLists', lists);
      client.broadcast.to(room).emit('joinUser', newUser);

      this.tempLists.set(room, [...lists, newUser]);
    } else {
      // this.server.to(room).emit('joinUser', newUser);
      client.broadcast.to(room).emit('joinUser', newUser);

      this.tempLists.set(room, [newUser]);
    }

    // 유저가 방문한 방 리스트 등록
    const joinRoomLists = this.userJoinRoomLists[client.id];
    if (joinRoomLists) {
      this.userJoinRoomLists[client.id] = [...joinRoomLists, room];
    } else {
      this.userJoinRoomLists[client.id] = [room];
    }
  }
}
