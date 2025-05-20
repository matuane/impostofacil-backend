import { FastifyRequest, FastifyReply } from 'fastify';
import { app } from '..';

declare module '@fastify/jwt' {
    interface FastifyJWT {
        payload: { id: string; type: string }
        user: { id: string; type: string }
    }
}

/**
 * Interface para estender o tipo Request do Express
 * e incluir informações do usuário autenticado
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                isAdmin: boolean;
            }
        }
    }
}

/**
 * Middleware para verificar se o token JWT é válido e é um access token
 * Utiliza o plugin @fastify/jwt para autenticação
 */
export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token não fornecido');
        }

        // Verifica se é um access token (não é um refresh token)
        const decoded = app.jwt.decode(token) as { type?: string };
        if (decoded.type === 'refresh') {
            throw new Error('Refresh token não pode ser usado para autenticação');
        }

        await request.jwtVerify();
    } catch (error) {
        reply.status(401).send({ 
            error: "Token de autenticação inválido ou não fornecido" 
        });
    }
}

/**
 * Middleware específico para verificar refresh token
 */
export async function authenticateRefreshToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new Error('Token não fornecido');
        }

        // Verifica se é um refresh token
        const decoded = app.jwt.decode(token) as { type?: string };
        if (decoded.type !== 'refresh') {
            throw new Error('Token inválido para refresh');
        }

        await request.jwtVerify();
    } catch (error) {
        reply.status(401).send({ 
            error: "Refresh token inválido ou não fornecido" 
        });
    }
} 