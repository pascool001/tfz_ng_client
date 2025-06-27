// export interface IPayload {
//     title: string;
//     completed: boolean;
// }



import { IOperator } from "./Operator";
import { IUser } from "./user";

export interface IAccount {
    _id?: string;
    user: IUser;
    operator: IOperator; 
    phone_number: string;
    accountType: string;
    support_fees: string;
}



export interface AccountStoreType {
    loading: boolean;
    accounts: IAccount[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}

