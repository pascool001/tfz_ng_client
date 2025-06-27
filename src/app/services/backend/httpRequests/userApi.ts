

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { IUser } from "../../models/user";


@Injectable({
    providedIn: "root"
})
export class UserApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    add(payload: IUser) {
        return this.api.post('/user', payload)
    }

    update(payload: IUser, id: string) {
        return this.api.put(`/user/${id}`, payload)
    }

    delete(id: string) {
        return this.api.delete(`/user/${id}`)
    }

    getOne(id:string) {
        return this.api.get(`/user/${id}`)
    }

    getAll() {
        return this.api.get('/user')
    }

   

}