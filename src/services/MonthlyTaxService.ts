import { CreateMonthlyTaxInput, MonthlyTaxFilters, Transaction, UpdateMonthlyTaxInput } from '../interfaces/MonthlyTax';
import prisma from '../lib/prisma';

/**
 * Serviço responsável por gerenciar os impostos mensais sobre operações financeiras
 */
export class MonthlyTaxService {
    /**
     * Calcula o imposto devido para uma operação de venda
     * @param transaction - Transação de venda para cálculo do imposto
     * @returns Registro de imposto criado
     * @throws Error se a transação for inválida ou não for uma venda
     */
    async calculateTaxForSale(transaction: Transaction) {
        if (!transaction || transaction.type !== 'venda') {
            throw new Error('Transação inválida ou não é uma venda');
        }

        // Buscar todas as compras do mesmo ativo que ainda não foram totalmente vendidas
        const buyTransactions = await prisma.transaction.findMany({
            where: {
                asset: {
                    ticker: transaction.assetName
                },
                type: 'compra',
                quantity: {
                    gt: prisma.transaction.fields.ticker_seller
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        let remainingQuantity = transaction.quantity;
        let totalCost = 0;
        let totalQuantity = 0;

        // Calcular média ponderada e atualizar quantidades vendidas
        for (const buyTx of buyTransactions) {
            totalCost += Number(buyTx.price_per_unit);

            // Se não há mais quantidade para vender, continua para a próxima compra
            if (remainingQuantity <= 0) continue;

            const availableQuantity = buyTx.quantity - buyTx.ticker_seller;
            if (availableQuantity <= 0) continue;

            // Garante que não usaremos mais que o disponível
            const quantityToUse = Math.min(availableQuantity, remainingQuantity);
            
            // Atualizar o custo total e quantidade
            totalQuantity += quantityToUse;
            
            // Atualizar a quantidade restante (nunca será negativa devido ao Math.min acima)
            remainingQuantity -= quantityToUse;

            // Atualizar ticker_seller imediatamente
            await prisma.transaction.update({
                where: { id: buyTx.id },
                data: {
                    ticker_seller: buyTx.ticker_seller + quantityToUse
                }
            });
        }

        // Se ainda houver quantidade restante, significa que não havia compras suficientes
        if (remainingQuantity > 0) {
            throw new Error('Quantidade de venda maior que a quantidade disponível em compras');
        }

        const averageCost = totalQuantity > 0 ? totalCost / buyTransactions.length : 0;
        const totalSaleValue = Number(transaction.total_value);
        const totalGain = totalSaleValue - (averageCost * transaction.quantity);

        // Buscar todas as vendas do mesmo ativo no mesmo mês
        const monthSales = await prisma.transaction.findMany({
            where: {
                asset: {
                    ticker: transaction.assetName
                },
                type: 'venda',
                date: {
                    gte: new Date(transaction.date.getFullYear(), transaction.date.getMonth(), 1),
                    lt: new Date(transaction.date.getFullYear(), transaction.date.getMonth() + 1, 1)
                }
            }
        });

        // Calcular o valor total vendido no mês
        const totalMonthSales = monthSales.reduce((acc, sale) => acc + Number(sale.total_value), 0) + totalSaleValue;

        let taxDue = 0;
        let carriedForwardTax = 0;

        // Se houver prejuízo, registra para compensação futura
        if (totalGain < 0) {
            carriedForwardTax = Math.abs(totalGain);
        } else {
            // Buscar prejuízos anteriores do mesmo ano
            const previousLosses = await prisma.monthlyTax.findMany({
                where: {
                    userId: transaction.userId,
                    year: transaction.date.getFullYear(),
                    month: {
                        lt: transaction.date.getMonth() + 1
                    },
                    total_gain: {
                        lt: 0
                    }
                }
            });

            // Calcular o total de prejuízos a compensar
            const totalLosses = previousLosses.reduce((acc: number, loss) => 
                acc + Math.abs(Number(loss.total_gain)), 0);
            const gainAfterCompensation = Math.max(0, totalGain - totalLosses);

            if (transaction.assetType === 'acao') {
                // Para ações: 15% se venda mensal > 20k e houver lucro
                if (totalMonthSales > 20000 && gainAfterCompensation > 0) {
                    taxDue = gainAfterCompensation * 0.15;
                }
            } else if (transaction.assetType === 'fii') {
                // Para FIIs: 20% sobre o lucro
                if (gainAfterCompensation > 0) {
                    taxDue = gainAfterCompensation * 0.20;
                }
            }
        }

        // Criar registro de imposto
        return this.create({
            year: transaction.date.getFullYear(),
            month: transaction.date.getMonth() + 1,
            asset_type: transaction.assetType,
            total_gain: totalGain,
            carried_forward_tax: carriedForwardTax,
            tax_due: taxDue,
            userId: transaction.userId
        });
    }

    /**
     * Cria um novo registro de imposto mensal
     * @param data - Dados do imposto a ser criado
     * @returns Registro de imposto criado
     */
    async create(data: CreateMonthlyTaxInput) {
        return prisma.monthlyTax.create({
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Busca todos os registros de imposto com filtros opcionais
     * @param filters - Filtros para a busca
     * @returns Lista de registros de imposto
     */
    async findAll(filters: MonthlyTaxFilters = {}) {
        const where: any = {};
        
        if (filters.year) {
            where.year = filters.year;
        }
        if (filters.month) {
            where.month = filters.month;
        }
        if (filters.userId) {
            where.userId = filters.userId;
        }
        if (filters.asset_type) {
            where.asset_type = filters.asset_type;
        }

        return prisma.monthlyTax.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Busca um registro de imposto pelo ID
     * @param id - ID do registro de imposto
     * @returns Registro de imposto encontrado
     */
    async findById(id: string) {
        return prisma.monthlyTax.findUnique({
            where: { id },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Atualiza um registro de imposto
     * @param id - ID do registro de imposto
     * @param data - Dados a serem atualizados
     * @returns Registro de imposto atualizado
     */
    async update(id: string, data: UpdateMonthlyTaxInput) {
        return prisma.monthlyTax.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true
                    }
                }
            }
        });
    }

    /**
     * Remove um registro de imposto
     * @param id - ID do registro de imposto
     * @returns Registro de imposto removido
     */
    async delete(id: string) {
        return prisma.monthlyTax.delete({
            where: { id }
        });
    }
} 