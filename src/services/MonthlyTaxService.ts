import prisma from '../lib/prisma';

export interface MonthlyTaxFilters {
    year?: number;
    month?: number;
    userId?: string;
    asset_type?: string;
}

export interface CreateMonthlyTaxInput {
    year: number;
    month: number;
    asset_type: string;
    total_gain: number;
    carried_forward_tax: number;
    tax_due: number;
    userId: string;
}

export interface UpdateMonthlyTaxInput {
    year?: number;
    month?: number;
    asset_type?: string;
    total_gain?: number;
    carried_forward_tax?: number;
    tax_due?: number;
}

export class MonthlyTaxService {
    async create(data: CreateMonthlyTaxInput) {
        return (prisma as any).monthly_taxes.create({
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

        return (prisma as any).monthly_taxes.findMany({
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

    async findById(id: string) {
        return (prisma as any).monthly_taxes.findUnique({
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

    async update(id: string, data: UpdateMonthlyTaxInput) {
        return (prisma as any).monthly_taxes.update({
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

    async delete(id: string) {
        return (prisma as any).monthly_taxes.delete({
            where: { id }
        });
    }
} 