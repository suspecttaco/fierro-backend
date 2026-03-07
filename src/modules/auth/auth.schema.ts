import { z } from "zod";

export const RegisterSchema = z.object({
    name:       z.string().min(2).max(100),
    email:      z.string().email(),
    password:   z.string().min(8).max(72),
    phone:      z.string().max(20).optional(),
});

export const LoginSchema = z.object({
    email:      z.string().email(),
    password:   z.string().min(1),
});

export const ForgotPasswordSchema = z.object({
    email:  z.string().min(1),
});

export const ResetPasswordSchema = z.object({
    token:      z.string().min(1),
    password:   z.string().min(8).max(72),
});

export const VerifyEmailSchema = z.object({
    token:  z.string().min(1),
});

export type RegisterInput       = z.infer<typeof RegisterSchema>;
export type LoginInput          = z.infer<typeof LoginSchema>;
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type VerifyEmailInput    = z.infer<typeof VerifyEmailSchema>;