import fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import { AppDataSource } from "./config/database";
import { OperacaoController } from "./controllers/OperacaoController";
import { AuthController } from "./controllers/AuthController";
import "reflect-metadata";

const app = fastify({ logger: true });

// Registrar plugins
app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
});

// Registrar JWT
app.register(jwt, {
    secret: process.env.JWT_SECRET || "impostofacil-key",
});

// Decorator para autenticação
app.decorate("authenticate", async (request: any, reply: any) => {
    try {
        await request.jwtVerify();
    } catch (err) {
        reply.send(err);
    }
});

// Inicializar o banco de dados
AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados inicializado com sucesso!");
    })
    .catch((error: any) => {
        console.error("Erro ao inicializar o banco de dados:", error);
    });

// Registrar rotas
const operacaoController = new OperacaoController();
operacaoController.registerRoutes(app);

const authController = new AuthController(app);
authController.registerRoutes(app);

// Rota de teste
app.get("/", async (request, reply) => {
    return { message: "API ImpostoFácil funcionando!" };
});

// Iniciar o servidor
const start = async () => {
    try {
        await app.listen({ port: 3001, host: "0.0.0.0" });
        console.log("Servidor rodando na porta 3001");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
