import { AppDataSource } from "../config/database";
import { Operacao } from "../entities/Operacao";

export class OperacaoRepository {
    private repository = AppDataSource.getRepository(Operacao);

    async findAll() {
        return await this.repository.find();
    }

    async findById(id: string) {
        return await this.repository.findOne({ where: { id } });
    }

    async create(operacao: Partial<Operacao>) {
        const novaOperacao = this.repository.create(operacao);
        return await this.repository.save(novaOperacao);
    }

    async update(id: string, operacao: Partial<Operacao>) {
        await this.repository.update(id, operacao);
        return await this.findById(id);
    }

    async delete(id: string) {
        const operacao = await this.findById(id);
        if (operacao) {
            await this.repository.delete(id);
            return true;
        }
        return false;
    }

    async findByPeriodo(dataInicio: Date, dataFim: Date) {
        return await this.repository
            .createQueryBuilder("operacao")
            .where("operacao.data BETWEEN :dataInicio AND :dataFim", {
                dataInicio,
                dataFim,
            })
            .getMany();
    }
} 