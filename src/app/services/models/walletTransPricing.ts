import { ICombination } from "./wallet";


export interface PricingRange {
  tp_tax_mode: string; // PCTG (pourcentage) / MTFIX (montant fix)
  tp_mtmin: number;
  tp_mtmax: number;
  tp_value: number
}

export interface IWalletTP {
  _id?: string;
  wallet_source_id: string;
  wallet_target_id: string;
  pricings: PricingRange[];
}

export interface WalletTPStoreType {
    loading: boolean;
    walletTPS: IWalletTP[];
    wallet_combination: ICombination | null;
    filter: { query: string; order: 'asc' | 'desc' };
}
