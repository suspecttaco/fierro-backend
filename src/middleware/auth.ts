import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../lib/jwt";

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ status: 401, code: 'NO_TOKEN', message: 'No autenticado'});
        return;
    }

    const token = header.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        res.locals.user = payload;
        next();
    } catch {
        res.status(401).json({ status: 401, code: 'INVALID_TOKEN', message: 'Token invalido'})
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = res.locals.user;

        if (!user || !roles.includes(user.role)) {
            res.status(403).json({ status: 403, code: 'FORBIDDEN', message: 'No tienes permisos para esta accion'});
            return;
        }

        next();
    };
};