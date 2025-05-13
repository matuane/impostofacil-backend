import prisma from '../lib/prisma';

/**
 * Interface para criação de um novo usuário
 * @property {string} email - Email do usuário
 * @property {string} password - Senha do usuário
 * @property {string} [refreshToken] - Token de refresh opcional para autenticação
 */
type CreateUserInput = {
    email: string;
    password: string;
    refreshToken?: string;
};

/**
 * Interface para atualização de um usuário existente
 * @property {string} [email] - Novo email do usuário
 * @property {string} [password] - Nova senha do usuário
 * @property {string} [refreshToken] - Novo token de refresh
 */
type UpdateUserInput = {
    email?: string;
    password?: string;
    refreshToken?: string;
};

/**
 * Repositório responsável por gerenciar as operações de CRUD de usuários no banco de dados
 */
export class UserRepository {
    /**
     * Retorna todos os usuários cadastrados no sistema
     * @returns {Promise<Array>} Lista de usuários
     */
    async findAll() {
        return await prisma.user.findMany();
    }

    /**
     * Busca um usuário pelo seu ID
     * @param {string} id - ID do usuário
     * @returns {Promise<Object|null>} Usuário encontrado ou null
     */
    async findById(id: string) {
        return await prisma.user.findUnique({
            where: { id }
        });
    }

    /**
     * Busca um usuário pelo seu email
     * @param {string} email - Email do usuário
     * @returns {Promise<Object|null>} Usuário encontrado ou null
     */
    async findByEmail(email: string) {
        return await prisma.user.findUnique({
            where: { email }
        });
    }

    /**
     * Cria um novo usuário no sistema
     * @param {CreateUserInput} data - Dados do usuário a ser criado
     * @returns {Promise<Object>} Usuário criado
     */
    async create(data: CreateUserInput) {
        return await prisma.user.create({
            data
        });
    }

    /**
     * Atualiza os dados de um usuário existente
     * @param {string} id - ID do usuário
     * @param {UpdateUserInput} data - Novos dados do usuário
     * @returns {Promise<Object>} Usuário atualizado
     */
    async update(id: string, data: UpdateUserInput) {
        return await prisma.user.update({
            where: { id },
            data
        });
    }

    /**
     * Remove um usuário do sistema
     * @param {string} id - ID do usuário
     * @returns {Promise<boolean>} true se removido com sucesso, false caso contrário
     */
    async delete(id: string) {
        try {
            await prisma.user.delete({
                where: { id }
            });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Atualiza o token de refresh de um usuário
     * @param {string} id - ID do usuário
     * @param {string} refreshToken - Novo token de refresh
     */
    async updateRefreshToken(id: string, refreshToken: string | undefined) {
        await prisma.user.update({
            where: { id },
            data: { refreshToken }
        });
    }
} 