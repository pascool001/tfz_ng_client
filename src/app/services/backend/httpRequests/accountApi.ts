

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { IAccount } from "../../models/account";


@Injectable({
    providedIn: "root"
})
export class AccountApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    add(payload: IAccount) {
        return this.api.post('/country', payload)
    }

    update(payload: IAccount, id: string) {
        return this.api.put(`/account/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/account/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/account/${id}`)
    }

    getAll() {
        return this.api.get('/account')
    }

   

}