export type CreateOperacaoInput = {
    tipo: string;
    ativo: string;
    quantidade: number;
    preco: number;
    valorTotal: number;
    data: Date;
    userId: string;
};

export type UpdateOperacaoInput = {
    tipo?: string;
    ativo?: string;
    quantidade?: number;
    preco?: number;
    valorTotal?: number;
    data?: Date;
    userId?: string;
};