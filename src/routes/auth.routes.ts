import { FastifyInstance } from 'fastify';
import { AuthController } from '../controllers/AuthController';
import { errorSchema, authSchema } from '../schemas';

/**
 * Configuração das rotas de autenticação
 */
export async function authRoutes(app: FastifyInstance) {
    const authController = new AuthController();

    app.post('/register', {
        schema: {
            tags: ['auth'],
            summary: 'Registra um novo usuário',
            body: {
                type: 'object',
                required: ['email', 'password', 'name'],
                properties: {
                    email: { type: 'string', format: 'email' },
                    password: { type: 'string', minLength: 6 },
                    name: {type: 'string'}
                }
            },
            response: {
                201: {
                    description: 'Usuário registrado com sucesso',
                    type: 'object',
                    properties: {
                        user: {
                            type: 'object',
                            properties: {
                                id: { type: 'string', format: 'uuid' },
                                email: { type: 'string', format: 'email' }
                            }
                        }
                    }
                },
                400: {
                    description: 'Email já cadastrado',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, authController.register);

    app.post('/login', {
        schema: {
            tags: ['auth'],
            summary: 'Realiza login do usuário',
            response: {
                200: {
                    description: 'Login realizado com sucesso',
                    ...authSchema
                },
                401: {
                    description: 'Credenciais inválidas',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        }
    }, authController.login);

    app.post('/refresh', {
        schema: {
            tags: ['auth'],
            summary: 'Atualiza o token de acesso usando refresh token',
            body: {
                type: 'object',
                required: ['refreshToken'],
                properties: {
                    refreshToken: { type: 'string' }
                }
            },
            response: {
                200: {
                    description: 'Tokens atualizados com sucesso',
                    type: 'object',
                    properties: {
                        accessToken: { type: 'string' },
                        refreshToken: { type: 'string' }
                    }
                },
                401: {
                    description: 'Token inválido',
                    ...errorSchema
                }
            }
        }
    }, authController.refreshToken);

    app.post('/change-password', {
        schema: {
            tags: ['auth'],
            summary: 'Altera a senha do usuário',
            security: [{ bearerAuth: [] }], 
            body: {
                type: 'object',
                required: ['newPassword'],
                properties: {
                    newPassword: { type: 'string', minLength: 6 }
                } 
            },
            response: {
                200: {
                    description: 'Senha alterada com sucesso',
                    type: 'null'
                },
                401: {
                    description: 'Token inválido',
                    ...errorSchema
                },  
                404: {
                    description: 'Usuário não encontrado',
                    ...errorSchema
                },
                400: {
                    description: 'Senha inválida',
                    ...errorSchema
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        },
        onRequest: [app.authenticate]
    }, authController.changePassword);

    app.post('/logout', {
        schema: {
            tags: ['auth'],
            summary: 'Realiza logout do usuário',
            security: [{ bearerAuth: [] }],
            response: {
                204: {
                    description: 'Logout realizado com sucesso',
                    type: 'null'
                },
                500: {
                    description: 'Erro interno do servidor',
                    ...errorSchema
                }
            }
        },
        onRequest: [app.authenticate]
    }, authController.logout);
} 