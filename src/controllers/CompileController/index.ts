import { Request, Response } from "express";

import { CompileCodeService } from "../../services/CompileCodeService";

export class CompileController {
  public static async store(req: Request, res: Response) {
    const compiledCode = await CompileCodeService.execute(req.body);

    return res.send(compiledCode);
  }
}
