import jwt from 'jsonwebtoken';
import fs from 'fs';
import { env } from "../config/env";
import { Payload } from '@prisma/client/runtime/client';

const privateKey = fs.readFileSync(env.JWT_PRIVATE_KEY_PATH, 'utf-8');
const publicKey = fs.readFileSync(env.JWT_PUBLIC_KEY_PATH, 'utf-8');

export interface JwtPayload {
    sub: string;    // userId
    email: string;
    role: string;
}

export const signAccessToken = (payload: JwtPayload): string => 
    jwt.sign(payload,privateKey, {
        algorithm: 'RS256',
        expiresIn: env.JWT_ACCESS_EXPIRY as jwt.SignOptions['expiresIn'],
    });

export const signRefreshToken = (payload: Pick<JwtPayload, 'sub'>): string => {
    return jwt.sign(payload, privateKey, {
        algorithm: 'RS256',
        expiresIn: env.JWT_REFRESH_EXPIRY as jwt.SignOptions['expiresIn'],
    });
};

export const verifyAccessToken = (token: string): JwtPayload => {
    return jwt.verify(token, publicKey, {algorithms: ['RS256']}) as JwtPayload;
};