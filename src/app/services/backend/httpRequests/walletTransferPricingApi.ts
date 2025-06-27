

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { IWallet } from "@models/wallet";
import { IWalletTP } from "@models/walletTransPricing";
//wallet-transfer-pricing

@Injectable({
    providedIn: "root"
})
export class WalletTransferPricingApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    add(payload: IWalletTP) {
        return this.api.post('/wallet-transfer-pricing', payload)
    }

    update(payload: IWalletTP, id: string) {
        return this.api.put(`/wallet-transfer-pricing/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/wallet-transfer-pricing/${id}`)
    }

    get(id:string) {
        return this.api.get(`/wallet-transfer-pricing/${id}`)
    }

    getAll() {
        return this.api.get('/wallet-transfer-pricing')
    }



}
