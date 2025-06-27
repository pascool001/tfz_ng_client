

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { IOperator } from "../../models/Operator";



@Injectable({
    providedIn: "root"
})
export class OperatorApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    create(payload: IOperator) {
        return this.api.post('/operator', payload)
    }

    update(payload: IOperator, id: string) {
        return this.api.put(`/operator/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/operator/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/operator/${id}`)
    }

    getAll() {
        return this.api.get('/operator')
    }

   

}