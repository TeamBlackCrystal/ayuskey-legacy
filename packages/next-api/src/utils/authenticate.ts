import { Request } from "express";

export const validateToken = (token: string) => token.length === 16;

export const getToken = (request: Request): string | null => {
    if (!request.headers.cookie) {
        return null
    }

    const cookie = JSON.parse(request.headers.cookie)

    if (!cookie.i || !validateToken(cookie.i)) {
        return null
    }

    return cookie.i
}