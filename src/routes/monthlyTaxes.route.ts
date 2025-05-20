import { FastifyInstance, FastifyRequest } from 'fastify';
import { MonthlyTaxController } from '../controllers/MonthlyTaxController';
import { monthlyTaxSchema, errorSchema } from '../schemas';

interface IParams {
    id: string;
}

export async function monthlyTaxRoutes(fastify: FastifyInstance) {
    const monthlyTaxController = new MonthlyTaxController();

    // Todas as rotas requerem autenticação
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/', {
        schema: {
            tags: ['monthly-taxes'],
            summary: 'Lista todos os impostos mensais',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    year: { type: 'integer', minimum: 1900 },
                    month: { type: 'integer', minimum: 1, maximum: 12 },
                    userId: { type: 'string', format: 'uuid' },
                    asset_type: { type: 'string' }
                }
            },
            response: {
                200: {
                    description: 'Lista de impostos mensais retornada com sucesso',
                    type: 'array',
                    items: monthlyTaxSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request, reply) => {
        return monthlyTaxController.findAll(request, reply);
    });

    fastify.get('/:id', {
        schema: {
            tags: ['monthly-taxes'],
            summary: 'Busca um imposto mensal pelo ID',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Imposto mensal encontrado com sucesso',
                    ...monthlyTaxSchema
                },
                404: {
                    description: 'Imposto mensal não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return monthlyTaxController.findById(request, reply);
    });

    fastify.put('/:id', {
        schema: {
            tags: ['monthly-taxes'],
            summary: 'Atualiza um imposto mensal existente',
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
                    year: { type: 'integer', minimum: 1900 },
                    month: { type: 'integer', minimum: 1, maximum: 12 },
                    asset_type: { type: 'string' },
                    total_gain: { type: 'number', format: 'float' },
                    carried_forward_tax: { type: 'number', format: 'float', minimum: 0 },
                    tax_due: { type: 'number', format: 'float', minimum: 0 }
                }
            },
            response: {
                200: {
                    description: 'Imposto mensal atualizado com sucesso',
                    ...monthlyTaxSchema
                },
                404: {
                    description: 'Imposto mensal não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return monthlyTaxController.update(request, reply);
    });

    fastify.delete('/:id', {
        schema: {
            tags: ['monthly-taxes'],
            summary: 'Remove um imposto mensal',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                204: {
                    description: 'Imposto mensal removido com sucesso',
                    type: 'null'
                },
                404: {
                    description: 'Imposto mensal não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return monthlyTaxController.delete(request, reply);
    });
} 