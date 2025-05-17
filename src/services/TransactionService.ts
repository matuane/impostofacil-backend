import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

export interface TransactionFilters {
    type?: string;
    userId?: string;
    assetId?: string;
}

export interface CreateTransactionInput {
    type: string;
    date: Date;
    quantity: number;
    price_per_unit: number;
    total_value?: number;
    userId: string;
    assetId: string;
}

export interface UpdateTransactionInput {
    type?: string;
    date?: Date;
    quantity?: number;
    price_per_unit?: number;
    total_value?: number;
}

export class TransactionService {
    async create(data: CreateTransactionInput) {
        const total_value = data.quantity * Number(data.price_per_unit);
        
        return (prisma as any).transaction.create({
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

        return (prisma as any).transaction.findMany({
            where
        });
    }

    async findById(id: string) {
        return (prisma as any).transaction.findUnique({
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
        }

        return (prisma as any).transaction.update({
            where: { id },
            data: updateData
        });
    }

    async delete(id: string) {
        return (prisma as any).transaction.delete({
            where: { id }
        });
    }
} 