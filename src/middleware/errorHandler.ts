import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError } from "../util/errors";

const isDev = process.env.NODE_ENV === 'development';

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error('ERROR:', err);

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

    // Errores conocidos de Prisma
    if (err?.code === 'P2003') {
        return res.status(409).json({
            status: 409,
            code: 'FK_CONSTRAINT',
            message: 'Referencia inválida: uno de los IDs enviados no existe en la base de datos',
            detail: err.meta,
            timestamp: new Date().toISOString(),
        });
    }

    if (err?.code === 'P2002') {
        return res.status(409).json({
            status: 409,
            code: 'DUPLICATE',
            message: 'Ya existe un registro con esos datos',
            ...(isDev && { detail: err.meta }),
            timestamp: new Date().toISOString(),
        });
    }

    // P2010 = raw query falló (ej. RAISE EXCEPTION de stored procedure)
    if (err?.code === 'P2010') {
        const msg = err?.meta?.driverAdapterError?.message ?? 'Error al ejecutar operación en la base de datos';
        return res.status(422).json({
            status: 422,
            code: 'DB_PROCEDURE_ERROR',
            message: msg,
            timestamp: new Date().toISOString(),
        });
    }

    const statusCode = err.statusCode ?? 500;
    const message = statusCode === 500 ? 'Error interno del servidor' : err.message;

    return res.status(statusCode).json({
        status: statusCode,
        code: err.code ?? 'INTERNAL_ERROR',
        message,
        ...(isDev && statusCode === 500 && { detail: err.message }),
        timestamp: new Date().toISOString(),
    });
};