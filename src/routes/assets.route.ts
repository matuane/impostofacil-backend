import { FastifyInstance, FastifyRequest } from 'fastify';
import { AssetController } from '../controllers/AssetController';
import { assetSchema, errorSchema } from '../schemas';

interface IParams {
    id: string;
}

export async function assetRoutes(fastify: FastifyInstance) {
    const assetController = new AssetController();

    // Todas as rotas requerem autenticação
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.post('/', {
        schema: {
            tags: ['assets'],
            summary: 'Cria um novo ativo',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['ticker', 'type'],
                properties: {
                    ticker: { type: 'string' },
                    type: { type: 'string' }
                }
            },
            response: {
                201: {
                    description: 'Ativo criado com sucesso',
                    ...assetSchema
                },
                400: {
                    description: 'Dados inválidos',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request, reply) => {
        return assetController.create(request, reply);
    });

    fastify.get('/', {
        schema: {
            tags: ['assets'],
            summary: 'Lista todos os ativos',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Lista de ativos retornada com sucesso',
                    type: 'array',
                    items: assetSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request, reply) => {
        return assetController.findAll(request, reply);
    });

    fastify.get('/:id', {
        schema: {
            tags: ['assets'],
            summary: 'Busca um ativo pelo ID',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Ativo encontrado com sucesso',
                    ...assetSchema
                },
                404: {
                    description: 'Ativo não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return assetController.findById(request, reply);
    });

    fastify.put('/:id', {
        schema: {
            tags: ['assets'],
            summary: 'Atualiza um ativo existente',
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
                    ticker: { type: 'string' },
                    type: { type: 'string' }
                }
            },
            response: {
                200: {
                    description: 'Ativo atualizado com sucesso',
                    ...assetSchema
                },
                404: {
                    description: 'Ativo não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return assetController.update(request, reply);
    });

    fastify.delete('/:id', {
        schema: {
            tags: ['assets'],
            summary: 'Remove um ativo',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                204: {
                    description: 'Ativo removido com sucesso',
                    type: 'null'
                },
                404: {
                    description: 'Ativo não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request: FastifyRequest<{ Params: IParams }>, reply) => {
        return assetController.delete(request, reply);
    });
} 