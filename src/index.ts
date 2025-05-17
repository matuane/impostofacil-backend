import "reflect-metadata";
import fastify from "fastify";
import jwt from "@fastify/jwt";
import cors from "@fastify/cors";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { AppDataSource } from "./config/database";
import { userRoutes } from "./routes/user.routes";
import { authRoutes } from "./routes/auth.routes";
import { assetRoutes } from "./routes/assets.route";
import { transactionRoutes } from "./routes/transactions.route";
import { monthlyTaxRoutes } from "./routes/monthlyTaxes.route";
import { swaggerOptions, swaggerUiOptions } from "./config/swagger";

export const app = fastify({ logger: true });

const initialize = async () => {
    // Registrar plugins
    await app.register(cors, {
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
    });

    // Configurar JWT
    await app.register(jwt, {
        secret: process.env.JWT_SECRET || "investfacil-key"
    });

    // Configurar Swagger - Importante: swagger deve ser registrado antes do swagger-ui
    await app.register(swagger, swaggerOptions);
    await app.register(swaggerUi, swaggerUiOptions);

    // Decorador para autenticação
    app.decorate("authenticate", async function(request: any, reply: any) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });

    // Inicializar banco de dados
    await AppDataSource.initialize().then(() => {
        console.log("Database initialized");
    }).catch((error) => {
        console.error("Error initializing database:", error);
    });

    // Registrar rotas
    await app.register(authRoutes, { prefix: '/auth' });
    await app.register(userRoutes, { prefix: '/users' });
    await app.register(assetRoutes, { prefix: '/assets' });
    await app.register(transactionRoutes, { prefix: '/transactions' });
    await app.register(monthlyTaxRoutes, { prefix: '/monthly-taxes' });

    return app;
};

// Iniciar servidor
const start = async () => {
    try {
        await initialize();
        await app.listen({ port: 3000 });
        console.log('Server running at http://localhost:3000');
        console.log('Swagger documentation available at http://localhost:3000/docs');
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
