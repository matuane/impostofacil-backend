import { UserRepository } from "../repositories/UserRepository";
import { User } from "../entities/User";
import { FastifyInstance } from "fastify";
import { app } from "..";

export class AuthService {
    private repository = new UserRepository();

    async register(email: string, password: string) {
        const existingUser = await this.repository.findByEmail(email);
        if (existingUser) {
            throw new Error("Email já cadastrado");
        }

        const user = new User();
        user.email = email;
        user.password = password;
        await user.hashPassword();

        return await this.repository.create(user);
    }

    async login(email: string, password: string) {
        const userData = await this.repository.findByEmail(email);
        if (!userData) {
            throw new Error("Usuário não encontrado");
        }

        const user = Object.assign(new User(), userData);
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            throw new Error("Senha inválida");
        }

        const accessToken = app.jwt.sign({ id: user.id }, { expiresIn: "1h" });
        const refreshToken = app.jwt.sign({ id: user.id }, { expiresIn: "7d" });

        await this.repository.updateRefreshToken(user.id, refreshToken);

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email
            }
        };
    }

    async refreshToken(refreshToken: string) {
        try {
            const decoded = app.jwt.verify(refreshToken) as { id: string };
            const user = await this.repository.findById(decoded.id);

            if (!user || user.refreshToken !== refreshToken) {
                throw new Error("Token inválido");
            }

            const newAccessToken = app.jwt.sign({ id: user.id }, { expiresIn: "1h" });
            const newRefreshToken = app.jwt.sign({ id: user.id }, { expiresIn: "7d" });

            await this.repository.updateRefreshToken(user.id, newRefreshToken);

            return {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            };
        } catch (error) {
            throw new Error("Token inválido");
        }
    }

    async logout(userId: string) {
        await this.repository.updateRefreshToken(userId, undefined);
    }
} 