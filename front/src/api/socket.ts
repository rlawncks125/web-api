import { io, type Socket } from "socket.io-client";

let socket: Socket;
const wsServerURI = "https://testapi.kimjuchan97.xyz";

export const init = () => {
  socket = io(`${wsServerURI}/webRPC`, {
    autoConnect: false,
    transports: ["websocket"],
  });
  connect();
  socketBaseRead();
};

const socketBaseRead = () => {
  socket.on("connect", () => {
    console.log("연결 되었습니다.");
  });

  socket.on("disconnect", (socket: any) => {
    console.log("연결이 끊겼습니다.", socket);
  });
  socket.on("error", (err) => {
    console.log("에러 발생 : ", err);
  });
};

const connect = () => {
  socket.connect();
};

export const isConneted = () => {
  return socket?.connected;
};

// ###################################
// ###########  socket on ############
// ###################################

export const emitJoinRoom = (payload: { room: string; offer: any }) => {
  socket.emit("joinRoom", payload);
};
export const catchJoinUser = (catchWs: (res: any) => void) => {
  socket.off("joinUser");
  socket.on("joinUser", (res: any) => {
    catchWs(res);
  });
};
export const catchUserLists = (catchWs: (res: any) => void) => {
  socket.off("userLists");
  socket.on("userLists", (res: any) => {
    catchWs(res);
  });
};

export const emitAnswer = (payload: { room: string; answer: any }) => {
  socket.emit("answer", payload);
};

export const catchCanser = (catchWs: (res: any) => void) => {
  socket.off("Canser");
  socket.on("Canser", (res: any) => {
    catchWs(res);
  });
};
export const emitIcecandidate = (payload: {
  room: string;
  icecandidate: any;
}) => {
  socket.emit("icecandidate", payload);
};

export const catchIcecandidate = (catchWs: (res: any) => void) => {
  socket.off("ice");
  socket.on("ice", (res: any) => {
    catchWs(res);
  });
};
export const catchIceList = (catchWs: (res: any) => void) => {
  socket.off("iceLists");
  socket.on("iceLists", (res: any) => {
    catchWs(res);
  });
};

export const emitLeaveUser = (payload: { room: string; stream: any }) => {
  socket.emit("leaveUser", payload);
};

export const catchLeaveuser = (catchWs: (res: any) => void) => {
  socket.off("leaveUser");
  socket.on("leaveUser", (res: any) => {
    catchWs(res);
  });
};
