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

export interface Transaction {
    id: string;
    type: string;
    date: Date;
    quantity: number;
    price_per_unit: number;
    total_value: number;
    assetId: string;
    assetType: string;
    assetName: string;
    userId: string;
}