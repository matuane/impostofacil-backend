import { FastifyInstance } from 'fastify';
import { DashboardController } from '../controllers/DashboardController';
import { errorSchema } from '../schemas';

export async function dashboardRoutes(fastify: FastifyInstance) {
    const dashboardController = new DashboardController();

    // Todas as rotas requerem autenticação
    fastify.addHook('preHandler', fastify.authenticate);

    fastify.get('/stats', {
        schema: {
            tags: ['dashboard'],
            summary: 'Obtém estatísticas da dashboard',
            security: [{ bearerAuth: [] }],
            response: {
                200: {
                    description: 'Estatísticas retornadas com sucesso',
                    type: 'object',
                    properties: {
                        totalInvestido: { type: 'number' },
                        lucroLiquido: { type: 'number' },
                        operacoes: { type: 'number' }
                    }
                },
                401: {
                    description: 'Usuário não autenticado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, async (request, reply) => {
        return dashboardController.getStats(request, reply);
    });
} 