export interface AssetFilters {
    ticker?: string;
    type?: string;
}

export interface CreateAssetInput {
    ticker: string;
    type: string;
    quantity: number;
    price_per_unit: number;
    userId: string;
    transactionType: string;
}

export interface UpdateAssetInput {
    ticker?: string;
    type?: string;
}
