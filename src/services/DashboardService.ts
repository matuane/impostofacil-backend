import { PrismaClient } from '../../prisma/generated/client';

const prisma = new PrismaClient();

export interface DashboardStats {
    totalInvestido: number;
    lucroLiquido: number;
    operacoes: number;
}

export class DashboardService {
    async getStats(userId: string): Promise<DashboardStats> {
        try {
            // Buscar todas as transações do usuário para calcular total investido e operações
            const transactions = await prisma.transaction.findMany({
                where: {
                    userId: userId
                },
                include: {
                    asset: true
                },
                orderBy: {
                    date: 'desc'
                }
            });

            // Buscar impostos mensais para calcular lucro líquido
            const monthlyTaxes = await prisma.monthlyTax.findMany({
                where: {
                    userId: userId
                }
            });

            // Calcular total investido (soma de todas as compras)
            let totalInvestido = 0;
            for (const transaction of transactions) {
                if (transaction.type === 'compra') {
                    totalInvestido += Number(transaction.total_value);
                }
            }
            totalInvestido = Number(totalInvestido.toFixed(2));

            // Calcular lucro líquido (soma do total_gain da tabela monthly_taxes)
            const lucroLiquido = Number(monthlyTaxes.reduce((sum, tax) => {
                return sum + Number(tax.total_gain);
            }, 0).toFixed(2));

            // Contar total de operações
            const operacoes = transactions.length;

            return {
                totalInvestido,
                lucroLiquido,
                operacoes
            };
        } catch (error) {
            console.error('Erro ao calcular estatísticas:', error);
            throw new Error('Erro ao calcular estatísticas da dashboard');
        }
    }
} 