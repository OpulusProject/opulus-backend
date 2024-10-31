import { NextFunction, Request, Response } from "express";

import { verifyJwt } from "@utils/jwt";

const deserializeUser = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken as string;

  if (!accessToken) {
    return next();
  }

  const decoded = verifyJwt(accessToken, "accessTokenPublicKey");

  if (decoded) {
    res.locals.user = decoded;
  }

  return next();
};

export default deserializeUser;
