import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from '../services/UserService';
import { authenticateToken } from '../middlewares/auth';
import { UpdateUserInput } from '../interfaces/user';

/**
 * Controller responsável por gerenciar as rotas relacionadas a usuários
 * Todas as rotas requerem autenticação
 */
export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }
    /**
     * Busca usuários com filtros opcionais
     */
    public async findUsers(request: FastifyRequest, reply: FastifyReply) {
        try {
            this.userService = new UserService()
            const query = request.query as { email?: string; name?: string };
            const filters = {
                email: query.email,
                name: query.name
            };

            const users = await this.userService.findUsers(filters);
            return reply.send(users);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            return reply.status(500).send({ 
                error: 'Erro interno do servidor ao buscar usuários' 
            });
        }
    }

    /**
     * Busca um usuário pelo ID
     */
    public async findUserById(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            this.userService = new UserService()
            const { id } = request.params;
            const user = await this.userService.findById(id);

            if (!user) {
                return reply.status(404).send({ 
                    error: 'Usuário não encontrado' 
                });
            }

            return reply.send(user);
        } catch (error) {
            console.error('Erro ao buscar usuário:', error);
            return reply.status(500).send({ 
                error: 'Erro interno do servidor ao buscar usuário' 
            });
        }
    }

    /**
     * Atualiza os dados de um usuário
     */
    public async updateUser(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            this.userService = new UserService()
            const { id } = request.params;
            const updateData = request.body as UpdateUserInput;

            // Verifica se o usuário existe
            const existingUser = await this.userService.findById(id);
            if (!existingUser) {
                return reply.status(404).send({ 
                    error: 'Usuário não encontrado' 
                });
            }

            // Verifica se o usuário tem permissão para atualizar
            const user = request.user as { id: string; isAdmin: boolean };
            if (user.id !== id && !user.isAdmin) {
                return reply.status(403).send({ 
                    error: 'Sem permissão para atualizar este usuário' 
                });
            }

            const updatedUser = await this.userService.update(id, updateData);
            return reply.send(updatedUser);
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            return reply.status(500).send({ 
                error: 'Erro interno do servidor ao atualizar usuário' 
            });
        }
    }

    /**
     * Remove um usuário do sistema
     */
    public async deleteUser(request: FastifyRequest<{
        Params: { id: string }
    }>, reply: FastifyReply) {
        try {
            this.userService = new UserService()
            const { id } = request.params;

            // Verifica se o usuário existe
            const existingUser = await this.userService.findById(id);
            if (!existingUser) {
                return reply.status(404).send({ 
                    error: 'Usuário não encontrado' 
                });
            }

            // Verifica se o usuário tem permissão para deletar
            const user = request.user as { id: string; isAdmin: boolean };
            if (user.id !== id && !user.isAdmin) {
                return reply.status(403).send({ 
                    error: 'Sem permissão para deletar este usuário' 
                });
            }

            await this.userService.delete(id);
            return reply.status(204).send();
        } catch (error) {
            console.error('Erro ao deletar usuário:', error);
            return reply.status(500).send({ 
                error: 'Erro interno do servidor ao deletar usuário' 
            });
        }
    }
} 