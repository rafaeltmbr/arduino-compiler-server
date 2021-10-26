import express from "express";

import { compileRouter } from "./compiler.routes";

export const router = express.Router();

router.use(compileRouter);
