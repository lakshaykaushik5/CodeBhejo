import { WebSocket } from "ws";

export class DataSave {
  private data: Map<String, String>;
  private connection: Map<string, Set<WebSocket>>;
  // private h_set: Set<WebSocket>;

  constructor() {
    this.data = new Map<string, string>();
    this.connection = new Map<string, Set<WebSocket>>();
    // this.h_set = new Set<WebSocket>();
  }

  addMsg(msg: string, key: string): void {
    this.data.set(key, msg);
  }

  addSockets(socket: WebSocket, key: string, msg: string): void {
    if (this.connection.has(key)) {
      const socket_set = this.connection.get(key);
      if (socket_set?.has(socket) === false) {
        this.connection.get(key)?.add(socket);
      }
    } else {
      const new_set = new Set<WebSocket>();
      new_set.add(socket);
      this.connection.set(key, new_set);
    }
  }

  getMsg(key: string) {
    if (this.data.has(key)) {
      return this.data.get(key);
    } else {
      return "No Data";
    }
  }

  getSockets(key: string): WebSocket[] | undefined {
    const data = this.connection.get(key);

    if (data && typeof data[Symbol.iterator] === "function") {
      const arr: WebSocket[] = [];
      for (const value of data) {
        arr.push(value);
      }
      return arr;
    } else {
      return [];
    }
  }
}
