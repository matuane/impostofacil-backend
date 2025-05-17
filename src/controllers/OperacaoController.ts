import { FastifyRequest, FastifyReply } from "fastify";
import { OperacaoService } from "../services/OperacaoService";
import { Operacao } from "../entities/Operacao";
import { CriarOperacaoDTO } from "../interfaces/operacao";

export class OperacaoController {
    private service = new OperacaoService();

    async listarOperacoes(request: FastifyRequest, reply: FastifyReply) {
        try {
            const operacoes = await this.service.listarOperacoes();
            return reply.send(operacoes);
        } catch (error: any) {
            return reply.status(500).send({ error: "Erro ao listar operações" });
        }
    }

    async buscarOperacao(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const operacao = await this.service.buscarOperacao(id);
            return reply.send(operacao);
        } catch (error: any) {
            if (error.message === "Operação não encontrada") {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: "Erro ao buscar operação" });
        }
    }

    async criarOperacao(request: FastifyRequest, reply: FastifyReply) {
        try {
            const operacao = request.body as CriarOperacaoDTO;
            const novaOperacao = await this.service.criarOperacao(operacao);
            return reply.status(201).send(novaOperacao);
        } catch (error: any) {
            if (error.message === "Todos os campos obrigatórios devem ser preenchidos") {
                return reply.status(400).send({ error: error.message });
            }
            return reply.status(500).send({ error: "Erro ao criar operação" });
        }
    }

    async atualizarOperacao(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const operacao = request.body as Partial<Operacao>;
            const operacaoAtualizada = await this.service.atualizarOperacao(id, operacao);
            return reply.send(operacaoAtualizada);
        } catch (error: any) {
            if (error.message === "Operação não encontrada") {
                return reply.status(404).send({ error: error.message });
            }
            return reply.status(500).send({ error: "Erro ao atualizar operação" });
        }
    }

    async deletarOperacao(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { id } = request.params as { id: string };
            const sucesso = await this.service.deletarOperacao(id);
            if (sucesso) {
                return reply.status(204).send();
            }
            return reply.status(404).send({ error: "Operação não encontrada" });
        } catch (error: any) {
            return reply.status(500).send({ error: "Erro ao deletar operação" });
        }
    }

    async buscarPorPeriodo(request: FastifyRequest, reply: FastifyReply) {
        try {
            const { dataInicio, dataFim } = request.query as { dataInicio: string; dataFim: string };
            const operacoes = await this.service.buscarPorPeriodo(
                new Date(dataInicio),
                new Date(dataFim)
            );
            return reply.send(operacoes);
        } catch (error: any) {
            return reply.status(500).send({ error: "Erro ao buscar operações por período" });
        }
    }
} 