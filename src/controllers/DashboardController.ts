import { FastifyRequest, FastifyReply } from 'fastify';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
    private dashboardService: DashboardService;

    constructor() {
        this.dashboardService = new DashboardService();
    }

    async getStats(request: FastifyRequest, reply: FastifyReply) {
        try {
            if (!request.user || !request.user.id) {
                return reply.status(401).send({ 
                    error: "Usuário não autenticado" 
                });
            }

            const stats = await this.dashboardService.getStats(request.user.id);
            return reply.send(stats);
        } catch (error) {
            console.error('Erro ao buscar estatísticas da dashboard:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar estatísticas'
            });
        }
    }
} 