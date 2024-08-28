import { WebSocket, WebSocketServer } from "ws";
import { DataSave } from "./DataSave";
import { createClient } from "redis";
import { Queue } from "./Queue";
import cluster from "cluster";
import os from "os";

const total_no_of_cpus = os.cpus().length;

const redis_client = createClient();
redis_client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

export class TaskManager {
  // private data: Map<string, string>;
  private user: WebSocket[];
  private sender: WebSocket | null;
  private dataSave: DataSave;
  private WebSockets_Queue: Queue<WebSocket>;

  constructor() {
    this.user = [];
    this.sender = null;
    this.dataSave = new DataSave();
    this.WebSockets_Queue = new Queue<WebSocket>();
  }

  addData(socket: WebSocket) {
    this.user.push(socket);
    // this.WebSockets_Queue.enqueue(socket);
    // if (cluster.isPrimary) {
    //   console.log(total_no_of_cpus);

    //   for (let i = 0; i < total_no_of_cpus; i++) {
    //     cluster.fork();
    //   }

    //   cluster.on("exit", () => {
    //     console.log("isPrimary exited");
    //   });
    // } else {
    //   const q_socket = this.WebSockets_Queue.dequeue();
    //   if (q_socket && q_socket !== undefined) {
    //     console.log(`Working ${process.pid} ________`);
    //   }
    // }
    this.addHandler(socket);
  }

  private addHandler(socket: WebSocket) {
    socket.on("message", (data: any) => {
      const message = JSON.parse(data.toString());
      const key = message.type;
      const msg = message.msg;
      if (msg != undefined && msg) {
        this.push_to_redis(key, msg);
      }
      this.sender = socket;
      this.dataSave.addSockets(socket, key, msg);
      this.saveData(key, msg);
      const send_msg = this.getData(key);
      const connectionsToSend = this.dataSave.getSockets(key);
      if (connectionsToSend != undefined && connectionsToSend?.length > 0) {
        connectionsToSend.map((to_send) => {
          if (to_send != this.sender) {
            console.log(to_send, " === ", this.sender, "++++++++++++++++++");
            console.log(to_send === this.sender);
            to_send.send(
              JSON.stringify({
                type: key,
                msg: send_msg,
              }),
            );
          }
        });
      }
    });
  }

  private saveData(key: string, msg: string) {
    this.dataSave.addMsg(msg, key);
  }

  private getData(key: string) {
    return this.dataSave.getMsg(key);
  }

  private async push_to_redis(key: string, msg: string) {
    try {
      await redis_client.lPush("data", JSON.stringify({ key, msg }));
    } catch (error) {
      console.log("Redis Error :", error);
    }
  }
}
