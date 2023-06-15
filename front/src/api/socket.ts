import { io, type Socket } from "socket.io-client";

let socket: Socket;
const wsServerURI = "https://myapi.juchandev.xyz";

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

export const emitJoinRoom = (room: string) => {
  socket.emit("joinRoom", room);
};

// offer

export const emitOffer = (payload: {
  room: string;
  offer: RTCSessionDescriptionInit;
}) => {
  socket.emit("offer", payload);
};

export const catchOffer = (
  catchWs: (offer: RTCSessionDescriptionInit) => void
) => {
  socket.off("recived_offer");
  socket.on("recived_offer", (offer: RTCSessionDescriptionInit) => {
    catchWs(offer);
  });
};

// answer
export const emitAnswer = (payload: {
  room: string;
  answer: RTCSessionDescriptionInit;
}) => {
  socket.emit("answer", payload);
};

export const catchAnswer = (catchWs: (res: any) => void) => {
  socket.off("recived_answer");
  socket.on("recived_answer", (res: any) => {
    catchWs(res);
  });
};

// Icecandidate
export const emitIcecandidate = (payload: {
  room: string;
  candidate: RTCIceCandidate;
}) => {
  socket.emit("candidate", payload);
};

export const catchIcecandidate = (
  catchWs: (candidate: RTCIceCandidate) => void
) => {
  socket.off("recived_candidate");
  socket.on("recived_candidate", (candidate: RTCIceCandidate) => {
    catchWs(candidate);
  });
};
