import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export interface AppError extends Error {
    statusCode?: number;
    code?: string;
}

export const errorHandler = (
    err: AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('ERROR:', err); // temporal
    // Error de validacion Zod
    if (err instanceof ZodError) {
        return res.status(400).json({
            status: 400,
            code: 'VALIDATION_ERROR',
            message: 'Datos invalidos',
            details: err.issues.map(e => ({
                field: e.path.join('.'),
                message: e.message,
            })),
            timestamp: new Date().toISOString(),
        });
    }

    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

    return res.status(statusCode).json({
        status: statusCode,
        code: err.code ?? 'INTERNAL_ERROR',
        message,
        timestamp: new Date().toISOString(),
    });
};