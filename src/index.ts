import express, { Express, Request, Response } from "express";
import http from "http";
import { initSocket } from "./socket";

import commentRoutes from "./routes/commentaire";
import profileRoutes from "./routes/profile";

const app: Express = express();
const port = Number(process.env.SERVER_PORT) || 8085;
const server = http.createServer(app);

/* 🔥 MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SOCKET */
initSocket(server);

/* ROUTES */
app.use("/api/comments", commentRoutes);
app.use("/api/profiles", profileRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
