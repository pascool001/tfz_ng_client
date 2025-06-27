// export interface IPayload {
//     title: string;
//     completed: boolean;
// }

import {ICountry} from './country'

export interface IOperator {
    _id?: string;
    country: ICountry ;
    oper_name: string;
    oper_logo_filename?: string;
    oper_logo?: string;
    oper_apiBaseUrl: string;
}

export interface OperatorStoreType {
    loading: boolean;
    operators: IOperator[];
    filter: { query: string; order: 'asc' | 'desc' };
}
