export interface MetodoPagamentoModel{
    id: string;
    nomeSuCarta: string;
    numero: string;
    cvv: string;
    dataScadenza: string;
    paypalEmail: string;
    tipoPagamento: TipoPagamentoEnum;
    isDefault: boolean;
}

export const TipoPagamentoEnum = {
    CartaDiCredito: 'CARTA_DI_CREDITO',
    Paypal: 'PAYPAL'
} as const;
export type TipoPagamentoEnum = typeof TipoPagamentoEnum[keyof typeof TipoPagamentoEnum];