import { UpdateUserInput, UserFilters } from '../interfaces/user';
import prisma  from '../lib/prisma';



/**
 * Serviço responsável pela lógica de negócio relacionada a usuários
 */
export class UserService {
    /**
     * Busca usuários com filtros opcionais
     * @param filters Filtros de busca (email, name)
     * @returns Lista de usuários que correspondem aos filtros
     */
    async findUsers(filters: UserFilters) {
        const where: any = {};
        
        if (filters.email) {
            where.email = { contains: filters.email };
        }
        if (filters.name) {
            where.name = { contains: filters.name };
        }

        return (prisma as any).user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                transactions: true,
                monthlyTaxes: true
            }
        });
    }

    async getUserPassword(id: string) {
        return (prisma as any).user.findUnique({
            where: { id },
            select: { password: true }
        });
    }

    /**
     * Busca um usuário pelo ID
     * @param id ID do usuário
     * @returns Usuário encontrado ou null
     */
    async findById(id: string) {
        return (prisma as any).user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                transactions: true,
                monthlyTaxes: true
            }
        });
    }

    /**
     * Atualiza os dados de um usuário
     * @param id ID do usuário
     * @param data Dados para atualização
     * @returns Usuário atualizado
     */
    async update(id: string, data: UpdateUserInput) {

        return (prisma as any).user.update({
            where: { id },
            data,
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                transactions: true,
                monthlyTaxes: true
            }
        });
    }

    /**
     * Remove um usuário do sistema
     * @param id ID do usuário
     * @returns true se removido com sucesso
     */
    async delete(id: string) {
        return prisma.user.delete({
            where: { id }
        });
    }
} 