import { PrismaClient } from '@prisma/client';
import prisma from '../lib/prisma';
import { MonthlyTaxService } from './MonthlyTaxService';
import { AssetFilters, CreateAssetInput, UpdateAssetInput } from '../interfaces/assets';

export class AssetService {
    async create(data: Partial<CreateAssetInput>) {
        const taxService = new MonthlyTaxService();
        return await prisma.$transaction(async (prisma) => {
            // Cria o ativo
            const asset = await prisma.asset.create({
                data: {
                    ticker: data.ticker!,
                    type: data.type!
                }
            });

            // Cria a transação inicial
            const transaction = await prisma.transaction.create({
                data: {
                    type: data.transactionType!,
                    date: new Date(),
                    quantity: data.quantity!,
                    price_per_unit: data.price_per_unit!,
                    total_value: data.quantity! * data.price_per_unit!,
                    userId: data.userId!,
                    assetId: asset.id
                }
            });

            if(data.transactionType === 'venda') {
                await taxService.calculateTaxForSale({
                    id: transaction.id,
                    type: data.transactionType!,
                    date: transaction.date,
                    quantity: transaction.quantity,
                    price_per_unit: Number(transaction.price_per_unit),
                    total_value: Number(transaction.total_value),
                    assetId: asset.id,
                    userId: data.userId!,
                    assetType: asset.type,
                    assetName: asset.ticker
                });
            }

            return {
                ...asset,
                transactions: [transaction]
            };
        }, {
            timeout: 30000 // 30 segundos
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

        return await prisma.asset.findMany({
            where,
            include: {
                transactions: true
            }
        });
    }

    async findById(id: string) {
        return await prisma.asset.findUnique({
            where: { id },
            include: {
                transactions: true
            }
        });
    }

    async update(id: string, data: UpdateAssetInput) {
        return await prisma.asset.update({
            where: { id },
            data,
            include: {
                transactions: true
            }
        });
    }

    async delete(id: string) {
        return await prisma.$transaction(async (prisma) => {
            // Primeiro deleta todas as transações relacionadas
            await prisma.transaction.deleteMany({
                where: { assetId: id }
            });

            // Depois deleta o ativo
            return await prisma.asset.delete({
                where: { id: id }
            });
        });
    }
} 