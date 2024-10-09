import { Request, Response, NextFunction } from "express";

const logResponse = (req: Request, res: Response, next: NextFunction) => {
  const originalSend = res.send;

  res.send = function (body: any) {
    console.log({
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      responseBody: body,
    });

    return originalSend.call(this, body);
  };

  next();
};

export default logResponse;
