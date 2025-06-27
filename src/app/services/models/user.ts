import { IAccount } from "./account";


export interface IUser {
    _id?: string;
    email: string;
    name: string;
    is_active: boolean;
    phone_number: string;
    user_type: string;
    profile: string;
    myAdmin: string;
    accounts: IAccount[]
}


export interface UserStoreType {
    loading: boolean;
    users: IUser[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}