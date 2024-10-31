import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

const validateResource =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body as Body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (e) {
      res.status(400).send((e as Error).message);
    }
  };

export default validateResource;
