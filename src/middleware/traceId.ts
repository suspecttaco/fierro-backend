import { Request, Response, NextFunction } from "express";
import { randomUUID } from "crypto";

export const traceId = (req: Request, res: Response, next: NextFunction ) => {
    const id = (req.headers['x-trace-id'] as string) ?? randomUUID();
    req.headers['x-trace-id'] = id;
    res.setHeader('xx-trace-id', id);
    next();
}