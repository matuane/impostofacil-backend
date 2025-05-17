import { FastifyInstance } from "fastify";
import "@fastify/jwt";

declare module "fastify" {
    interface FastifyInstance {
        authenticate: any;
    }

    interface FastifyRequest {
        user: {
            id: string
        }
    }
}

declare module "@fastify/jwt" {
    interface FastifyJWT {
        payload: {
            id: string;
        };
        user: {
            id: string;
        };
    }
}