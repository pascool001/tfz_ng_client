// export interface IPayload {
//     title: string;
//     completed: boolean;
// }

// import { IOperator } from "./Operator";

export interface ICountry {
    _id?: string;
    country_indic: string;
    country_code: string;
    country_name: string;
    country_flag?: string;
    image?: string;
}

type Status = "success" | "error" | "null";

export interface CountryStoreType {
    loading: boolean;
    countries: ICountry[];
    selectedId: string;
    filter: { query: string; order: 'asc' | 'desc' };
}

