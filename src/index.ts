import "dotenv/config";

import express, { Express, Request, Response } from "express";
import http from "http";
import { initSocket } from "./socket";
import cors from "cors";
// import inboxRoutes from "./routes/inbox/index";
import authRoutes from "./routes/auth";

import commentRoutes from "./routes/commentaire";
import profileRoutes from "./routes/profile";

const app: Express = express();
app.use(express.json());

const port = Number(process.env.SERVER_PORT) || 8085;
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

/* MIDDLEWARES */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* SOCKET */
initSocket(server);

// ROUTES
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/profiles", profileRoutes);
app.use("/api/v1/auth", authRoutes);

app.get("/", (_req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// app.use("/api/v1/inbox", inboxRoutes);

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
