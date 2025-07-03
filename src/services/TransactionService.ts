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
        // Verificar se a transação existe
        const existingTransaction = await prisma.transaction.findUnique({
            where: { id }
        });

        if (!existingTransaction) {
            throw new Error('Transaction not found');
        }

        let updateData: any = {};
        
        // Converter e validar os dados
        if (data.type !== undefined) updateData.type = data.type;
        if (data.date !== undefined) updateData.date = new Date(data.date);
        if (data.quantity !== undefined) updateData.quantity = Number(data.quantity);
        if (data.price_per_unit !== undefined) updateData.price_per_unit = Number(data.price_per_unit);
        
        // Calcular total_value se quantity ou price_per_unit foram alterados
        if (data.quantity !== undefined || data.price_per_unit !== undefined) {
            const newQuantity = data.quantity !== undefined ? Number(data.quantity) : existingTransaction.quantity;
            const newPrice = data.price_per_unit !== undefined ? Number(data.price_per_unit) : Number(existingTransaction.price_per_unit);
            updateData.total_value = newQuantity * newPrice;
        }

        return prisma.transaction.update({
            where: { id },
            data: updateData,
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

    async delete(id: string) {
        return await prisma.$transaction(async (prisma: any) => {

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