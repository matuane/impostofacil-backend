import { FastifyInstance, FastifyRequest } from 'fastify';
import { TransactionController } from '../controllers/TransactionController';
import { transactionSchema, errorSchema } from '../schemas';

interface IParams {
    id: string;
}

export async function transactionRoutes(fastify: FastifyInstance) {
    const transactionController = new TransactionController();

    // Todas as rotas requerem autenticação
    fastify.addHook('preHandler', fastify.authenticate);


    fastify.get('/', {
        schema: {
            tags: ['transactions'],
            summary: 'Lista todas as transações',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['compra', 'venda'] },
                    userId: { type: 'string', format: 'uuid' },
                    assetId: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Lista de transações retornada com sucesso',
                    type: 'array',
                    items: transactionSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request, reply) => {
        return transactionController.findAll(request, reply);
    });

    fastify.get('/:id', {
        schema: {
            tags: ['transactions'],
            summary: 'Busca uma transação pelo ID',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Transação encontrada com sucesso',
                    ...transactionSchema
                },
                404: {
                    description: 'Transação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return transactionController.findById(request, reply);
    });

    fastify.put('/:id', {
        schema: {
            tags: ['transactions'],
            summary: 'Atualiza uma transação existente',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    type: { type: 'string', enum: ['compra', 'venda'] },
                    date: { type: 'string', format: 'date-time' },
                    quantity: { type: 'integer', minimum: 1 },
                    price_per_unit: { type: 'number', format: 'float', minimum: 0 }
                }
            },
            response: {
                200: {
                    description: 'Transação atualizada com sucesso',
                    ...transactionSchema
                },
                404: {
                    description: 'Transação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return transactionController.update(request, reply);
    });

    fastify.delete('/:id', {
        schema: {
            tags: ['transactions'],
            summary: 'Remove uma transação',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                204: {
                    description: 'Transação removida com sucesso',
                    type: 'null'
                },
                404: {
                    description: 'Transação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return transactionController.delete(request, reply);
    });
} 