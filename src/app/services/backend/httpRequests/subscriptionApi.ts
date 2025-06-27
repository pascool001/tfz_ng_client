

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { ISubscription } from "../../models/subscription";


@Injectable({
    providedIn: "root"
})
export class SubscriptionApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    add(payload: ISubscription) {
        return this.api.post('/subscription', payload)
    }

    update(payload: ISubscription, id: string) {
        return this.api.put(`/subscription/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/subscription/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/subscription/${id}`)
    }

    getAll() {
        return this.api.get('/subscription')
    }

   

}