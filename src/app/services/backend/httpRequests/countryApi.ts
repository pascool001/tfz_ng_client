

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "../httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { ICountry } from "../../models/country";


@Injectable({
    providedIn: "root"
})
export class CountryApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance 
    }

    addCountry(payload: ICountry) {
        return this.api.post('/country', payload)
    }

    updateCountry(payload: ICountry, id: string) {
        return this.api.put(`/country/${id}`, payload)
    }

    deleteCountry(id: string) {
        return this.api.delete(`/country/${id}`)
    }

    getCountry(id:string) {
        return this.api.get(`/country/${id}`)
    }

    getAll() {
        return this.api.get('/country')
    }

   

}