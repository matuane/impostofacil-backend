export const userSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
        name: {type: 'string'},
        refreshToken: { type: 'string', nullable: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
};

export const assetSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        ticker: { type: 'string' },
        type: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
};

export const transactionSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        type: { type: 'string', enum: ['compra', 'venda'] },
        date: { type: 'string', format: 'date-time' },
        quantity: { type: 'integer', minimum: 1 },
        price_per_unit: { type: 'number', format: 'float', minimum: 0 },
        total_value: { type: 'number', format: 'float', minimum: 0 },
        userId: { type: 'string', format: 'uuid' },
        assetId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
};

export const monthlyTaxSchema = {
    type: 'object',
    properties: {
        id: { type: 'string', format: 'uuid' },
        year: { type: 'integer', minimum: 1900 },
        month: { type: 'integer', minimum: 1, maximum: 12 },
        asset_type: { type: 'string' },
        total_gain: { type: 'number', format: 'float' },
        carried_forward_tax: { type: 'number', format: 'float', minimum: 0 },
        tax_due: { type: 'number', format: 'float', minimum: 0 },
        userId: { type: 'string', format: 'uuid' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
    }
};

export const errorSchema = {
    type: 'object',
    properties: {
        error: { type: 'string' }
    }
};

export const authSchema = {
    type: 'object',
    properties: {
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        user: {
            type: 'object',
            properties: {
                id: { type: 'string', format: 'uuid' },
                email: { type: 'string', format: 'email' }
            }
        }
    }
}; 