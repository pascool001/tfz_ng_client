

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { ITransferType } from "@models/transferType";


@Injectable({
    providedIn: "root"
})
export class TransferTypeApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    add(payload: ITransferType) {
        return this.api.post('/transfer_type', payload)
    }

    update(payload: ITransferType, id: string) {
        return this.api.put(`/transfer_type/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/transfer_type/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/transfer_type/${id}`)
    }

    getAll() {
        return this.api.get('/transfer_type')
    }



}
