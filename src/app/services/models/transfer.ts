import { IAccount } from "./account";
import { IService } from "./service";

export interface specific_C2C {
  payee_account: string;
  payee_amount: number;
  payee_amount_recovered: boolean;
  fees: number;
  fees_recovered: boolean;
}


export interface specific_SUBS {
   subscription_recovered: boolean;
}

export interface specific_RECO {
  recovered_refs: string[];
}

export interface specifics {
  c2c: specific_C2C,
  subs: specific_SUBS,
  reco: specific_RECO
}

export interface ITransfer {
  _id?: string;
  type: string; 
  amount: number; 
  src_account: IAccount; 
  target_account: IAccount;
  transfer_status: string;
  operator_resp: string; 
  service: IService;
  specific: specifics
}


export interface TransferStoreType {
    loading: boolean;
    transfers: ITransfer[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}

