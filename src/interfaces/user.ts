/**
 * Interface para criação de um novo usuário
 * @property {string} email - Email do usuário
 * @property {string} password - Senha do usuário
 * @property {string} [refreshToken] - Token de refresh opcional para autenticação
 */
export interface CreateUserInput {
    email: string;
    password: string;
    refreshToken?: string;
}

/**
 * Interface para atualização de um usuário existente
 * @property {string} [email] - Novo email do usuário
 * @property {string} [password] - Nova senha do usuário
 * @property {string} [refreshToken] - Novo token de refresh
 */
export interface UpdateUserInput {
    email?: string;
    password?: string;
    refreshToken?: string;
}

/**
 * Interface para o modelo de usuário
 */
export interface User {
    id: string;
    email: string;
    password: string;
    refreshToken?: string;
    isAdmin: boolean;
    createdAt: Date;
    updatedAt: Date;
}
