import { OperacaoRepository } from "../repositories/OperacaoRepository";
import { Operacao } from "../entities/Operacao";

export class OperacaoService {
    private repository = new OperacaoRepository();

    async listarOperacoes() {
        return await this.repository.findAll();
    }

    async buscarOperacao(id: string) {
        const operacao = await this.repository.findById(id);
        if (!operacao) {
            throw new Error("Operação não encontrada");
        }
        return operacao;
    }

    async criarOperacao(operacao: Partial<Operacao>) {
        // Validações básicas
        if (!operacao.tipo || !operacao.ativo || !operacao.quantidade || !operacao.preco || !operacao.data) {
            throw new Error("Todos os campos obrigatórios devem ser preenchidos");
        }

        // Calcula o valor total
        operacao.valorTotal = operacao.quantidade * operacao.preco;

        return await this.repository.create(operacao);
    }

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

    async deletarOperacao(id: string) {
        const operacao = await this.buscarOperacao(id);
        return await this.repository.delete(id);
    }

    async buscarPorPeriodo(dataInicio: Date, dataFim: Date) {
        return await this.repository.findByPeriodo(dataInicio, dataFim);
    }
} 