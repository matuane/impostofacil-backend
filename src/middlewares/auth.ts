import { FastifyRequest, FastifyReply } from 'fastify';

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
 * Middleware para verificar se o token JWT é válido
 * Utiliza o plugin @fastify/jwt para autenticação
 */
export async function authenticateToken(request: FastifyRequest, reply: FastifyReply) {
    try {
        await request.jwtVerify();
    } catch (error) {
        reply.status(401).send({ 
            error: "Token de autenticação inválido ou não fornecido" 
        });
    }
} 