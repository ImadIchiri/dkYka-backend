import express, { Express, Request, Response } from "express";
import postRouter from "./routes/posts";
import router from "./routes/media";

const app: Express = express();
const port = Number(process.env.SERVER_PORT) || 8085;

// Middleware JSON
app.use(express.json());

// Routes
app.use(postRouter);
app.use(router);

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
