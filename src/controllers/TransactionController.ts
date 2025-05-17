import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionService, TransactionFilters, CreateTransactionInput, UpdateTransactionInput } from '../services/TransactionService';

export class TransactionController {
    private transactionService: TransactionService;

    constructor() {
        this.transactionService = new TransactionService();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as CreateTransactionInput;
            const transaction = await this.transactionService.create(data);
            return reply.status(201).send(transaction);
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao criar transação'
            });
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as TransactionFilters;
            const transactions = await this.transactionService.findAll(query);
            return reply.send(transactions);
        } catch (error) {
            console.error('Erro ao buscar transações:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar transações'
            });
        }
    }

    async findById(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const transaction = await this.transactionService.findById(id);

            if (!transaction) {
                return reply.status(404).send({
                    error: 'Transação não encontrada'
                });
            }

            return reply.send(transaction);
        } catch (error) {
            console.error('Erro ao buscar transação:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar transação'
            });
        }
    }

    async update(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const updateData = request.body as UpdateTransactionInput;

            const transaction = await this.transactionService.update(id, updateData);
            return reply.send(transaction);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao atualizar transação'
            });
        }
    }

    async delete(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            await this.transactionService.delete(id);
            return reply.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar transação:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao deletar transação'
            });
        }
    }
} 