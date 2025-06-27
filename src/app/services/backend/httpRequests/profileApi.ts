

import { Injectable } from "@angular/core";
import { AxiosHttpClient } from "@backend/httpClient/axios-http-client";
import { AxiosInstance } from "axios";

import { IProfil } from "@models/profil";


@Injectable({
    providedIn: "root"
})
export class ProfilApi {

    api: AxiosInstance;

    constructor(private client: AxiosHttpClient) {
        this.api = this.client.Instance
    }

    addProfil(payload: IProfil) {
        return this.api.post('/profil', payload)
    }

    updateProfil(payload: IProfil, id: string) {
        return this.api.put(`/profil/${id}`, payload)
    }

    deleteProfil(id: string) {
        return this.api.delete(`/profil/${id}`)
    }

    getProfil(id:string) {
        return this.api.get(`/profil/${id}`)
    }

    getAll() {
        return this.api.get('/profil')
    }



}
