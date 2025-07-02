

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { IPricingRange } from "@models/transPricing";


//wallet-transfer-pricing

@Injectable({
    providedIn: "root"
})
export class TransferPricingApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    add(payload: IPricingRange) {
        return this.api.post('/transfer-pricing', payload)
    }

    update(payload: IPricingRange, id: string) {
        return this.api.put(`/transfer-pricing/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/transfer-pricing/${id}`)
    }

    get(id:string) {
        return this.api.get(`/transfer-pricing/${id}`)
    }

    getAll() {
        return this.api.get('/transfer-pricing')
    }



}
