import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import { CreateTransactionInput, TransactionFilters, UpdateTransactionInput } from '../interfaces/transactions';


export class TransactionService {
    async create(data: CreateTransactionInput) {
        const total_value = data.quantity * Number(data.price_per_unit);
        
        return prisma.transaction.create({
            data: {
                type: data.type,
                date: data.date,
                quantity: data.quantity,
                price_per_unit: data.price_per_unit,
                total_value: total_value,
                userId: data.userId,
                assetId: data.assetId
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                },
                asset: true
            }
        });
    }

    async findAll(filters: TransactionFilters = {}) {
        const where: any = {};
        
        if (filters.type) {
            where.type = filters.type;
        }
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.assetId) {
            where.assetId = filters.assetId;
        }

        return prisma.transaction.findMany({
            where
        });
    }

    async findById(id: string) {
        return prisma.transaction.findUnique({
            where: { id }
        });
    }

    async update(id: string, data: UpdateTransactionInput) {
        let updateData = { ...data };
        
        if (data.quantity && data.price_per_unit) {
            updateData = {
                ...updateData,
                total_value: data.quantity * Number(data.price_per_unit)
            };
        } else if (data.quantity) {
            const transaction = await prisma.transaction.findUnique({
                where: { id }
            });
            if (transaction) {
                updateData.total_value = (data.quantity * Number(transaction.price_per_unit));
            }
        } else if (data.price_per_unit) {
            const transaction = await prisma.transaction.findUnique({
                where: { id }
            });
            if (transaction) {
                updateData.total_value = (transaction.quantity * Number(data.price_per_unit));
            }
        }
        return prisma.transaction.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return await prisma.$transaction(async (prisma) => {

            const transaction = await prisma.transaction.findUnique({
                where: { id }
            });
            

            // Primeiro deleta o ativo
            await prisma.transaction.delete({
                where: { id }
            });

            // Depois deleta todas as transações relacionadas
            return await prisma.asset.delete({
                where: { id: transaction?.assetId }
            });
        });
    }
} 