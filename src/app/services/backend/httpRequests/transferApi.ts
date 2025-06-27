

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { ITransfer } from "../../models/transfer";


@Injectable({
    providedIn: "root"
})
export class TransferApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    add(payload: ITransfer) {
        return this.api.post('/transfer', payload)
    }

    update(payload: ITransfer, id: string) {
        return this.api.put(`/transfer/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/transfer/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/transfer/${id}`)
    }

    getAll() {
        return this.api.get('/transfer')
    }

   

}