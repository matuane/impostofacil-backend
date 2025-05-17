import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';

export interface AssetFilters {
    ticker?: string;
    type?: string;
}

export interface CreateAssetInput {
    ticker: string;
    type: string;
}

export interface UpdateAssetInput {
    ticker?: string;
    type?: string;
}

export class AssetService {
    async create(data: CreateAssetInput) {
        return (prisma as any).assets.create({
            data,
            include: {
                transactions: true
            }
        });
    }

    async findAll(filters: AssetFilters = {}) {
        const where: any = {};
        
        if (filters.ticker) {
            where.ticker = { contains: filters.ticker };
        }
        if (filters.type) {
            where.type = { contains: filters.type };
        }

        return (prisma as any).assets.findMany({
            where,
            include: {
                transactions: true
            }
        });
    }

    async findById(id: string) {
        return (prisma as any).assets.findUnique({
            where: { id },
            include: {
                transactions: true
            }
        });
    }

    async update(id: string, data: UpdateAssetInput) {
        return (prisma as any).assets.update({
            where: { id },
            data,
            include: {
                transactions: true
            }
        });
    }

    async delete(id: string) {
        return (prisma as any).assets.delete({
            where: { id }
        });
    }
} 