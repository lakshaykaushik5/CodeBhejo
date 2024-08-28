import { WebSocketServer, WebSocket } from "ws";
import { TaskManager } from "./TaskManager";

const taskManger = new TaskManager();
const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  taskManger.addData(ws);
});

console.log(`Server Started at port = 8080 :::::::::::`);
