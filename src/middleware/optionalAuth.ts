import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (header?.startsWith('Bearer ')) {
        try {
            const token = header.split(' ')[1];
            res.locals.user = verifyAccessToken(token);
        } catch (e) {
            // token invalido - continuar como anonimo
        }
    }
    next();
};