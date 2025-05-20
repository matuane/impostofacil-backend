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