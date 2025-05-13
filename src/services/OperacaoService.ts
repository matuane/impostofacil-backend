import { OperacaoRepository } from "../repositories/OperacaoRepository";
import { Operacao } from "../entities/Operacao";

/**
 * Interface para criação de operação com campos obrigatórios
 */
type CriarOperacaoDTO = {
    tipo: string;
    ativo: string;
    quantidade: number;
    preco: number;
    data: Date;
    userId: string;
};

/**
 * Serviço responsável pela lógica de negócio relacionada às operações financeiras
 * Implementa validações, cálculos e regras de negócio antes de persistir os dados
 */
export class OperacaoService {
    private repository = new OperacaoRepository();

    /**
     * Lista todas as operações cadastradas no sistema
     * @returns {Promise<Array>} Lista de operações
     */
    async listarOperacoes() {
        return await this.repository.findAll();
    }

    /**
     * Busca uma operação específica pelo ID
     * @param {string} id - ID da operação
     * @returns {Promise<Object>} Operação encontrada
     * @throws {Error} Se a operação não for encontrada
     */
    async buscarOperacao(id: string) {
        const operacao = await this.repository.findById(id);
        if (!operacao) {
            throw new Error("Operação não encontrada");
        }
        return operacao;
    }

    /**
     * Cria uma nova operação no sistema
     * Realiza validações dos campos obrigatórios e calcula o valor total
     * @param {CriarOperacaoDTO} operacao - Dados da operação a ser criada
     * @returns {Promise<Object>} Operação criada
     * @throws {Error} Se campos obrigatórios não forem fornecidos
     */
    async criarOperacao(operacao: CriarOperacaoDTO) {
        // Validações básicas
        if (!operacao.tipo || !operacao.ativo || !operacao.quantidade || !operacao.preco || !operacao.data || !operacao.userId) {
            throw new Error("Todos os campos obrigatórios devem ser preenchidos");
        }

        // Calcula o valor total
        const valorTotal = operacao.quantidade * operacao.preco;

        return await this.repository.create({
            ...operacao,
            valorTotal
        });
    }

    /**
     * Atualiza uma operação existente
     * Recalcula o valor total se quantidade ou preço forem alterados
     * @param {string} id - ID da operação
     * @param {Partial<Operacao>} operacao - Novos dados da operação
     * @returns {Promise<Object>} Operação atualizada
     */
    async atualizarOperacao(id: string, operacao: Partial<Operacao>) {
        const operacaoExistente = await this.buscarOperacao(id);
        
        // Se houver alteração na quantidade ou preço, recalcula o valor total
        if (operacao.quantidade || operacao.preco) {
            const quantidade = operacao.quantidade || operacaoExistente.quantidade;
            const preco = operacao.preco || operacaoExistente.preco;
            operacao.valorTotal = quantidade * preco;
        }

        return await this.repository.update(id, operacao);
    }

    /**
     * Remove uma operação do sistema
     * @param {string} id - ID da operação
     * @returns {Promise<boolean>} true se a operação foi removida com sucesso
     */
    async deletarOperacao(id: string) {
        const operacao = await this.buscarOperacao(id);
        return await this.repository.delete(id);
    }

    /**
     * Busca operações realizadas em um período específico
     * @param {Date} dataInicio - Data inicial do período
     * @param {Date} dataFim - Data final do período
     * @returns {Promise<Array>} Lista de operações no período
     */
    async buscarPorPeriodo(dataInicio: Date, dataFim: Date) {
        return await this.repository.findByPeriodo(dataInicio, dataFim);
    }
} 