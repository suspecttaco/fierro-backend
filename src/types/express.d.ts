import { JwtPayload } from "../lib/jwt";

declare global {
    namespace Express {
        interface Locals {
            user: JwtPayload;
        }
    }
}