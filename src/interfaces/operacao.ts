/**
 * Interface para criação de operação com campos obrigatórios
 */
export type CriarOperacaoDTO = {
    tipo: string;
    ativo: string;
    quantidade: number;
    preco: number;
    data: Date;
    userId: string;
};


/**
 * Interface para criação de uma nova operação
 * @property {string} tipo - Tipo da operação (compra/venda)
 * @property {string} ativo - Código do ativo negociado
 * @property {number} quantidade - Quantidade negociada
 * @property {number} preco - Preço unitário da operação
 * @property {number} valorTotal - Valor total da operação
 * @property {Date} data - Data da operação
 * @property {string} userId - ID do usuário que realizou a operação
 */
export type CreateOperacaoInput = {
    tipo: string;
    ativo: string;
    quantidade: number;
    preco: number;
    valorTotal: number;
    data: Date;
    userId: string;
};

/**
 * Interface para atualização de uma operação existente
 * Todos os campos são opcionais
 */
export type UpdateOperacaoInput = {
    tipo?: string;
    ativo?: string;
    quantidade?: number;
    preco?: number;
    valorTotal?: number;
    data?: Date;
    userId?: string;
};