import { io, type Socket } from "socket.io-client";
import { API_URL } from "@/lib/api/config";
import { getTokens } from "@/lib/api/tokens";

// A single app-wide socket.io connection to the realtime gateway. The gateway
// lives at the server root (not under the /api prefix), so we strip /api off the
// REST base. Auth rides the handshake as `auth.token`; using the function form
// means the latest access token is read on every (re)connect — so a token
// refresh mid-session is picked up automatically on the next reconnect.
const SOCKET_URL = API_URL.replace(/\/api\/?$/, "");

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      autoConnect: true,
      auth: (cb) => cb({ token: getTokens()?.accessToken ?? "" }),
    });
  }
  return socket;
}

// Join/leave a job room. The gateway authorizes access on join (same rule as the
// REST endpoints) and rejects via the ack if the user can't see the job.
export function joinJob(code: string): void {
  getSocket().emit("joinJob", code);
}

export function leaveJob(code: string): void {
  socket?.emit("leaveJob", code);
}

// Tear the connection down on logout so the next user opens a fresh handshake.
export function disconnectSocket(): void {
  socket?.disconnect();
  socket = null;
}
