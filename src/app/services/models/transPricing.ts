export interface IPricingRange {
  _id?: string;
  source_wallet: string;
  target_wallet: string;
  tp_tax_mode: string; // PCTG (pourcentage) / MTFIX (montant fix)
  tp_mtmin: number;
  tp_mtmax: number;
  tp_value: number
}

export interface ItransDirIds {
  sourceId: string;
  targetId: string;
}

export interface PricingStoreType {
  loading: boolean;
  pricings: IPricingRange[];
  transDirectionIds: ItransDirIds;
  filter: { query: string; order: 'asc' | 'desc' };
}
