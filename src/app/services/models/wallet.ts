
// import {ICountry} from './country'
export interface ICombination {
  w_source: IWallet;
  w_target: IWallet;
  isActive: boolean;
}

export interface IWallet {
    _id?: string;
    country: string;
    wallet_name: string;
    wallet_logo_filename: string;
    wallet_logo?: string;
}

export interface WalletStoreType {
    loading: boolean;
    wallets: IWallet[];
    countryId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}
