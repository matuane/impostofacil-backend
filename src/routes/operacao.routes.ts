import { FastifyInstance } from 'fastify';
import { OperacaoController } from '../controllers/OperacaoController';
import { authenticateToken } from '../middlewares/auth';
import { operacaoSchema, errorSchema } from '../schemas';

/**
 * Configuração das rotas de operações financeiras
 * Todas as rotas são protegidas por autenticação
 */
export async function operacaoRoutes(app: FastifyInstance) {
    // Aplica autenticação em todas as rotas
    app.addHook('preHandler', authenticateToken);

    const operacaoController = new OperacaoController();

    // Rotas de operações
    app.get('/', {
        schema: {
            tags: ['operacoes'],
            summary: 'Lista todas as operações',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Lista de operações retornada com sucesso',
                    type: 'array',
                    items: operacaoSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, operacaoController.listarOperacoes);

    app.get('/:id', {
        schema: {
            tags: ['operacoes'],
            summary: 'Busca uma operação pelo ID',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Operação encontrada com sucesso',
                    ...operacaoSchema
                },
                404: {
                    description: 'Operação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, operacaoController.buscarOperacao);

    app.post('/', {
        schema: {
            tags: ['operacoes'],
            summary: 'Cria uma nova operação',
            security: [{ bearerAuth: [] }],
            body: {
                type: 'object',
                required: ['tipo', 'ativo', 'quantidade', 'preco', 'data', 'userId'],
                properties: {
                    tipo: { type: 'string', enum: ['compra', 'venda'] },
                    ativo: { type: 'string' },
                    quantidade: { type: 'number', format: 'float' },
                    preco: { type: 'number', format: 'float' },
                    data: { type: 'string', format: 'date-time' },
                    userId: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                201: {
                    description: 'Operação criada com sucesso',
                    ...operacaoSchema
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
    }, operacaoController.criarOperacao);

    app.put('/:id', {
        schema: {
            tags: ['operacoes'],
            summary: 'Atualiza uma operação existente',
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
                    tipo: { type: 'string', enum: ['compra', 'venda'] },
                    ativo: { type: 'string' },
                    quantidade: { type: 'number', format: 'float' },
                    preco: { type: 'number', format: 'float' },
                    data: { type: 'string', format: 'date-time' }
                }
            },
            response: {
                200: {
                    description: 'Operação atualizada com sucesso',
                    ...operacaoSchema
                },
                404: {
                    description: 'Operação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, operacaoController.atualizarOperacao);

    app.delete('/:id', {
        schema: {
            tags: ['operacoes'],
            summary: 'Remove uma operação',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                204: {
                    description: 'Operação removida com sucesso',
                    type: 'null'
                },
                404: {
                    description: 'Operação não encontrada',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, operacaoController.deletarOperacao);

    app.get('/periodo', {
        schema: {
            tags: ['operacoes'],
            summary: 'Busca operações por período',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                required: ['dataInicio', 'dataFim'],
                properties: {
                    dataInicio: { type: 'string', format: 'date-time' },
                    dataFim: { type: 'string', format: 'date-time' }
                }
            },
            response: {
                200: {
                    description: 'Lista de operações retornada com sucesso',
                    type: 'array',
                    items: operacaoSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, operacaoController.buscarPorPeriodo);
} 