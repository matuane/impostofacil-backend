import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    // Register new user
    public async register(request: FastifyRequest, reply: FastifyReply){
        try {
            this.service = new AuthService();

            const { email, password, name } = request.body as { email: string; password: string; name: string };
            if(!email || !password || !name) {
                return reply.status(400).send({ error: "Email, senha e nome são obrigatórios" });
            }
            const user = await this.service.register(email, password, name);
            return reply.status(201).send({
                user: {
                    id: user.id,
                    email: user.email
                }
            });
        } catch (error: any) {
            if (error.message === "Email já cadastrado") {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: "Erro ao registrar usuário" });
        }
    }

    // Login
    public async login(request: FastifyRequest, reply: FastifyReply) {
        try {
            this.service = new AuthService();
            const authHeader: string = request.headers['authorization'] || "";

            if (!authHeader || !authHeader.startsWith('Basic ')) {
                throw new Error('Authorization header missing or not Basic');
              }
              
              // Remove o prefixo "Basic " e decodifica a string base64
              const base64Credentials = authHeader.slice(6);
              const credentials = Buffer.from(base64Credentials, 'base64').toString('utf8');
              
              // credentials estará no formato "email:password"
              const [email, password] = credentials.split(':');
              
              if (!email || !password) {
                throw new Error('Invalid Basic Auth format');
              }
            const result = await this.service.login(email, password);
            return reply.send(result);
        } catch (error: any) {
            if (error.message === "Usuário não encontrado" || error.message === "Senha inválida") {
                return reply.status(401).send({ error: error.message });
            }
            return reply.status(500).send({ error: "Erro ao fazer login" });
        }
    }

    // Refresh token
    public async refreshToken(request: FastifyRequest, reply: FastifyReply) {
        try {
            this.service = new AuthService();
            const { refreshToken } = request.body as { refreshToken: string };
            const tokens = await this.service.refreshToken(refreshToken);
            return reply.send(tokens);
        } catch (error: any) {
            return reply.status(401).send({ error: "Token inválido" });
        }
    }
    // Logout
    public async logout(request: FastifyRequest, reply: FastifyReply) {
        try {
            this.service = new AuthService();
            // Verifica se o usuário está autenticado e tem um ID válido
            if (!request.user || !request.user.id) {
                return reply.status(401).send({ 
                    error: "Usuário não autenticado" 
                });
            }

            await this.service.logout(request.user.id);
            return reply.status(204).send();
        } catch (error: any) {
            console.error('Erro ao fazer logout:', error);
            return reply.status(500).send({ 
                error: "Erro ao fazer logout" 
            });
        }
    }

    // Change Password
    public async changePassword(request: FastifyRequest, reply: FastifyReply) {
        try {
            this.service = new AuthService();
            
            // Verifica se o usuário está autenticado
            if (!request.user || !request.user.id) {
                return reply.status(401).send({ 
                    error: "Usuário não autenticado" 
                });
            }

            const { newPassword } = request.body as { 
                newPassword: string 
            };

            if (!newPassword) {
                return reply.status(400).send({ 
                    error: "Senha atual e nova senha são obrigatórias" 
                });
            }

            const result = await this.service.changePassword(
                request.user.id,
                newPassword
            );

            return reply.send(result);
        } catch (error: any) {
            if (error.message === "Sua nova senha deve ser diferente da senha atual") {
                return reply.status(400).send({ error: error.message });
            }
            if (error.message === "Usuário não encontrado") {
                return reply.status(404).send({ error: error.message });
            }
            console.error('Erro ao alterar senha:', error);
            return reply.status(500).send({ 
                error: "Erro ao alterar senha" 
            });
        }
    }
} 