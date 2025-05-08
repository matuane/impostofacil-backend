import fastify from "fastify";
import cors from "@fastify/cors";
import { AppDataSource } from "./config/database";
import { OperacaoController } from "./controllers/OperacaoController";
import "reflect-metadata";

const app = fastify({ logger: true });

// Registrar plugins
app.register(cors, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
});

// Inicializar o banco de dados
AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados inicializado com sucesso!");
    })
    .catch((error) => {
        console.error("Erro ao inicializar o banco de dados:", error);
    });

// Registrar rotas
const operacaoController = new OperacaoController();
operacaoController.registerRoutes(app);

// Rota de teste
app.get("/", async (request, reply) => {
    return { message: "API ImpostoFácil funcionando!" };
});

// Iniciar o servidor
const start = async () => {
    try {
        await app.listen({ port: 3001, host: "0.0.0.0" });
        console.log("Servidor rodando na porta 3000");
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
