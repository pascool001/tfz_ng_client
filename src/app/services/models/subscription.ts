import { IService } from "./service";
import { ITransfer } from "./transfer";
import { IUser } from "./user";

export interface ISubscription  {
    _id?: string;
    user: IUser; 
    service: IService; 
    transfert: ITransfer;
    nb_period: number; 
    end_date: Date; 
  }



export interface SubscriptionStoreType {
    loading: boolean;
    subscriptions: ISubscription[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}

