import { FastifyInstance } from 'fastify';
import { UserController } from '../controllers/UserController';
import { authenticateToken } from '../middlewares/auth';
import { userSchema, errorSchema } from '../schemas';

/**
 * Configuração das rotas de usuário
 * Todas as rotas são protegidas por autenticação
 */
export async function userRoutes(app: FastifyInstance) {
    // Aplica autenticação em todas as rotas
    app.addHook('preHandler', authenticateToken);

    const userController = new UserController();

    // Rotas de usuário
    app.get('/', {
        schema: {
            tags: ['users'],
            summary: 'Lista todos os usuários',
            security: [{ bearerAuth: [] }],
            querystring: {
                type: 'object',
                properties: {
                    email: { type: 'string', format: 'email', nullable: true, },
                    name: { type: 'string', nullable: true,  }
                }
            },
            response: {
                200: {
                    description: 'Lista de usuários retornada com sucesso',
                    type: 'array',
                    items: userSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, userController.findUsers);

    app.get('/:id', {
        schema: {
            tags: ['users'],
            summary: 'Busca um usuário pelo ID',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                200: {
                    description: 'Usuário encontrado com sucesso',
                    ...userSchema
                },
                404: {
                    description: 'Usuário não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, userController.findUserById);

    app.put('/:id', {
        schema: {
            tags: ['users'],
            summary: 'Atualiza um usuário existente',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            body: {
                type: 'object',
                properties: {
                    name: { type: 'string' }
                }
            },
            response: {
                200: {
                    description: 'Usuário atualizado com sucesso',
                    ...userSchema
                },
                404: {
                    description: 'Usuário não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, userController.updateUser);

    app.delete('/:id', {
        schema: {
            tags: ['users'],
            summary: 'Remove um usuário',
            security: [{ bearerAuth: [] }],
            params: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' }
                }
            },
            response: {
                204: {
                    description: 'Usuário removido com sucesso',
                    type: 'null'
                },
                404: {
                    description: 'Usuário não encontrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, userController.deleteUser);
} 