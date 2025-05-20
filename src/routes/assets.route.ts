import { FastifyInstance, FastifyRequest } from 'fastify';
import { AssetController } from '../controllers/AssetController';
import { assetSchema, errorSchema } from '../schemas';

interface IParams {
    id: string;
}

// Enum para os tipos de ativos permitidos
const ASSET_TYPES = ['acao', 'fii'] as const;
const TRANSACTION_TYPES = ['compra', 'venda'] as const;

type TransactionType = typeof TRANSACTION_TYPES[number];
type AssetType = typeof ASSET_TYPES[number];

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
                    type: { 
                        type: 'string',
                        enum: ASSET_TYPES,
                        description: 'Tipo do ativo (acao ou fii)'
                    }
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
        },
        onRequest: [fastify.authenticate]
    }, async (request, reply) => {
        const { transactionType, type } = request.body as { transactionType: string; type: string };
        if (!TRANSACTION_TYPES.includes(transactionType as TransactionType)) {
            return reply.status(400).send({
                error: 'Tipo de transação inválido. Deve ser "compra" ou "venda"'
            });
        }
        
        if (!ASSET_TYPES.includes(type as AssetType)) {
            return reply.status(400).send({
                error: 'Tipo de ativo inválido. Deve ser "acao" ou "fii"'
            });
        }

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