import { FastifyRequest, FastifyReply } from 'fastify';
import { MonthlyTaxService, MonthlyTaxFilters, CreateMonthlyTaxInput, UpdateMonthlyTaxInput } from '../services/MonthlyTaxService';

export class MonthlyTaxController {
    private monthlyTaxService: MonthlyTaxService;

    constructor() {
        this.monthlyTaxService = new MonthlyTaxService();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as CreateMonthlyTaxInput;
            const monthlyTax = await this.monthlyTaxService.create(data);
            return reply.status(201).send(monthlyTax);
        } catch (error) {
            console.error('Erro ao criar imposto mensal:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao criar imposto mensal'
            });
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as MonthlyTaxFilters;
            const monthlyTaxes = await this.monthlyTaxService.findAll(query);
            return reply.send(monthlyTaxes);
        } catch (error) {
            console.error('Erro ao buscar impostos mensais:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar impostos mensais'
            });
        }
    }

    async findById(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const monthlyTax = await this.monthlyTaxService.findById(id);

            if (!monthlyTax) {
                return reply.status(404).send({
                    error: 'Imposto mensal não encontrado'
                });
            }

            return reply.send(monthlyTax);
        } catch (error) {
            console.error('Erro ao buscar imposto mensal:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar imposto mensal'
            });
        }
    }

    async update(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const updateData = request.body as UpdateMonthlyTaxInput;

            const monthlyTax = await this.monthlyTaxService.update(id, updateData);
            return reply.send(monthlyTax);
        } catch (error) {
            console.error('Erro ao atualizar imposto mensal:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao atualizar imposto mensal'
            });
        }
    }

    async delete(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            await this.monthlyTaxService.delete(id);
            return reply.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar imposto mensal:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao deletar imposto mensal'
            });
        }
    }
} 