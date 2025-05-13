import { FastifyInstance } from "fastify";
import { AuthService } from "../services/AuthService";

export class AuthController {
    private service: AuthService;

    constructor(app: FastifyInstance) {
        this.service = new AuthService(app);
    }

    async registerRoutes(app: FastifyInstance) {
        // Register new user
        app.post("/auth/register", async (request, reply) => {
            try {
                const { email, password } = request.body as { email: string; password: string };
                const user = await this.service.register(email, password);
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
        });

        // Login
        app.post("/auth/login", async (request, reply) => {
            try {
                const { email, password } = request.body as { email: string; password: string };
                const result = await this.service.login(email, password);
                return reply.send(result);
            } catch (error: any) {
                if (error.message === "Usuário não encontrado" || error.message === "Senha inválida") {
                    return reply.status(401).send({ error: error.message });
                }
                return reply.status(500).send({ error: "Erro ao fazer login" });
            }
        });

        // Refresh token
        app.post("/auth/refresh", async (request, reply) => {
            try {
                const { refreshToken } = request.body as { refreshToken: string };
                const tokens = await this.service.refreshToken(refreshToken);
                return reply.send(tokens);
            } catch (error: any) {
                return reply.status(401).send({ error: "Token inválido" });
            }
        });

        // Logout
        app.post("/auth/logout", {
            onRequest: [app.authenticate]
        }, async (request, reply) => {
            try {
                const userId = request.user.id;
                await this.service.logout(userId);
                return reply.status(204).send();
            } catch (error: any) {
                return reply.status(500).send({ error: "Erro ao fazer logout" });
            }
        });
    }
} 