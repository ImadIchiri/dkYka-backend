import express, { Express, Request, Response } from "express";
import http from "http";
import { initSocket } from "./socket";

const app: Express = express();
const port = Number(process.env.SERVER_PORT) || 8085;
const server = http.createServer(app);

initSocket(server);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
