

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { IWallet } from "@models/wallet";

@Injectable({
    providedIn: "root"
})
export class WalletApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    add(payload: IWallet) {
        return this.api.post('/wallet', payload)
    }

    update(payload: IWallet, id: string) {
        return this.api.put(`/wallet/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/wallet/${id}`)
    }

    get(id:string) {
        return this.api.get(`/wallet/${id}`)
    }

    getAll() {
        return this.api.get('/wallet')
    }



}
