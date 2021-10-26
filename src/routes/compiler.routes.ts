import express from "express";
import { celebrate, Joi, Segments } from "celebrate";

import { supportedBoards } from "../config/boards";
import { CompileController } from "../controllers/CompileController";

export const compileRouter = express.Router();

compileRouter.post(
  "/compile",
  celebrate({
    [Segments.BODY]: {
      board_fqbn: Joi.string()
        .valid(...supportedBoards)
        .required(),
      code: Joi.string().required(),
    },
  }),
  CompileController.store
);
