import express from "express";
import { NextFunction, Request, Response } from "express";
import { errors } from "celebrate";

import "express-async-errors";

import { router } from "./routes/index.routes";

import * as dotenv from "dotenv";
dotenv.config();

const app = express();

app.disable("x-powered-by");

app.use(express.json());

app.use(router);

app.use(errors());

app.use((err: Error, req: Request, res: Response, _: NextFunction) => {
  return res.status(400).json({ message: err.message });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () =>
  console.log(`Server listening at http://localhost:${PORT}`)
);
