import { FastifyDynamicSwaggerOptions } from '@fastify/swagger';
import { FastifySwaggerUiOptions } from '@fastify/swagger-ui';

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
    swagger: {
        info: {
            title: 'ImpostoFacil API',
            description: 'API para gerenciamento de operações financeiras e cálculo de impostos',
            version: '1.0.0'
        },
        externalDocs: {
            url: 'https://github.com/seu-usuario/impostofacil',
            description: 'Encontre mais informações aqui'
        },
        tags: [
            { name: 'auth', description: 'Autenticação endpoints' },
            { name: 'users', description: 'Operações de usuários' },
            { name: 'assets', description: 'Gerenciamento de ativos' },
            { name: 'transactions', description: 'Operações de compra e venda' },
            { name: 'monthly-taxes', description: 'Cálculo e gerenciamento de impostos mensais' }
        ],
        schemes: ['http', 'https'],
        consumes: ['application/json'],
        produces: ['application/json'],
        securityDefinitions: {
            bearerAuth: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header'
            }
        }
    }
};

export const swaggerUiOptions: FastifySwaggerUiOptions = {
    routePrefix: '/docs',
    uiConfig: {
        docExpansion: 'list',
        deepLinking: false
    },
    uiHooks: {
        onRequest: function (request: any, reply: any, next: any) { next() },
        preHandler: function (request: any, reply: any, next: any) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header: any) => header
}; 