import { FastifyRequest, FastifyReply } from 'fastify';
import { AssetService } from '../services/AssetService';
import { AssetFilters, CreateAssetInput, UpdateAssetInput } from '../interfaces/assets';

export class AssetController {
    private assetService: AssetService;

    constructor() {
        this.assetService = new AssetService();
    }

    async create(request: FastifyRequest, reply: FastifyReply) {
        try {
            const data = request.body as Partial<CreateAssetInput>;
            if (!request.user || !request.user.id) {
                return reply.status(401).send({ 
                    error: "Usuário não autenticado" 
                });
            }
            data.userId = request.user.id;
            const asset = await this.assetService.create(data);
            return reply.status(201).send(asset);
        } catch (error) {
            console.error('Erro ao criar ativo:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao criar ativo'
            });
        }
    }

    async findAll(request: FastifyRequest, reply: FastifyReply) {
        try {
            const query = request.query as AssetFilters;
            const assets = await this.assetService.findAll(query);
            return reply.send(assets);
        } catch (error) {
            console.error('Erro ao buscar ativos:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar ativos'
            });
        }
    }

    async findById(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const asset = await this.assetService.findById(id);

            if (!asset) {
                return reply.status(404).send({
                    error: 'Ativo não encontrado'
                });
            }

            return reply.send(asset);
        } catch (error) {
            console.error('Erro ao buscar ativo:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao buscar ativo'
            });
        }
    }

    async update(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            const updateData = request.body as UpdateAssetInput;

            const asset = await this.assetService.update(id, updateData);
            return reply.send(asset);
        } catch (error) {
            console.error('Erro ao atualizar ativo:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao atualizar ativo'
            });
        }
    }

    async delete(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            const { id } = request.params;
            await this.assetService.delete(id);
            return reply.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar ativo:', error);
            return reply.status(500).send({
                error: 'Erro interno do servidor ao deletar ativo'
            });
        }
    }
} 