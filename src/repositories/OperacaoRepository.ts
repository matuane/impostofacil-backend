import { CreateOperacaoInput, UpdateOperacaoInput } from '../interfaces/operacao';
import prisma from '../lib/prisma';

/**
 * Repositório responsável por gerenciar as operações de CRUD de operações financeiras no banco de dados
 */
export class OperacaoRepository {
    /**
     * Retorna todas as operações cadastradas
     * @returns {Promise<Array>} Lista de operações
     */
    async findAll() {
        return await prisma.operacao.findMany();
    }

    /**
     * Busca uma operação pelo seu ID
     * @param {string} id - ID da operação
     * @returns {Promise<Object|null>} Operação encontrada ou null
     */
    async findById(id: string) {
        return await prisma.operacao.findUnique({
            where: { id }
        });
    }

    /**
     * Cria uma nova operação no sistema
     * @param {CreateOperacaoInput} data - Dados da operação a ser criada
     * @returns {Promise<Object>} Operação criada
     */
    async create(data: CreateOperacaoInput) {
        return await prisma.operacao.create({
            data
        });
    }

    /**
     * Atualiza os dados de uma operação existente
     * @param {string} id - ID da operação
     * @param {UpdateOperacaoInput} data - Novos dados da operação
     * @returns {Promise<Object>} Operação atualizada
     */
    async update(id: string, data: UpdateOperacaoInput) {
        return await prisma.operacao.update({
            where: { id },
            data
        });
    }

    /**
     * Remove uma operação do sistema
     * @param {string} id - ID da operação
     * @returns {Promise<boolean>} true se removida com sucesso, false caso contrário
     */
    async delete(id: string) {
        try {
            await prisma.operacao.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Busca operações realizadas em um período específico
     * @param {Date} dataInicio - Data inicial do período
     * @param {Date} dataFim - Data final do período
     * @returns {Promise<Array>} Lista de operações no período
     */
    async findByPeriodo(dataInicio: Date, dataFim: Date) {
        return await prisma.operacao.findMany({
            where: {
                data: {
                    gte: dataInicio,
                    lte: dataFim
                }
            }
        });
    }
} 