

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";
import { IService } from "../../models/service";


@Injectable({
    providedIn: "root"
})
export class ServiceApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    add(payload: IService) {
        return this.api.post('/service', payload)
    }

    update(payload: IService, id: string) {
        return this.api.put(`/service/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/service/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/service/${id}`)
    }

    getAll() {
        return this.api.get('/service')
    }

   

}