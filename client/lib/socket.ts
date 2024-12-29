import envs from "@/configs/envs";
import { io, Manager, ManagerOptions, SocketOptions } from "socket.io-client";

const manager = new Manager(envs.NEXT_PUBLIC_WS_SERVER_URL, {
  autoConnect: false,
  reconnectionAttempts: 20,
  reconnectionDelay: 3000,
});

export type TCreateSocket = Partial<ManagerOptions & SocketOptions> & {
  url: string;
  namespace?: string;
};
export const createSocket = ({ url, namespace, ...props }: TCreateSocket) => {
  const URL = !namespace
    ? url
    : namespace.startsWith("/")
    ? url + namespace
    : url + "/" + namespace;
  return io(URL, props);
};

export default manager;
